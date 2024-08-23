import CartManager from './cartManager.js';

export default class BookFetcher {
	constructor(APIKey, startIndex = 0, maxResults = 6) {
		this.APIKey = APIKey;
		this.startIndex = startIndex;
		this.maxResults = maxResults;
		this.navContainer = document.querySelector('.conteiner__navigation ul');
		this.booksContainer = document.querySelector('#books');
		this.loadMoreButton = document.querySelector('#load-more');
		
		this.cartManager = null; // Начальная инициализация cartManager
		
		this.fetchInit();
		this.fetchFirstBook();
		this.LoadMore();
	}

	fetchInit() {
		this.navContainer.addEventListener('click', (event) => {
			if (event.target.tagName === 'LI') {
				console.log('CLICK');
				this.setActiveClass(event.target);
				const url = event.target.getAttribute('data-url');
				this.startIndex = 0; // Сбрасываем startIndex при выборе новой категории
				this.fetchBooks(url);
			}
		});
	}

	setActiveClass(clickedElement) {
		const activeElement = this.navContainer.querySelector('li.active');
		if (activeElement) {
			activeElement.classList.remove('active');
		}
		clickedElement.classList.add('active');
	}

	async fetchBooks(subject) {
		console.log('this.startIndex', this.startIndex);
		const url = `https://www.googleapis.com/books/v1/volumes?q="subject:${subject}"&key=${this.APIKey}&printType=books&startIndex=${this.startIndex}&maxResults=${this.maxResults}&langRestrict=en`;
		
		try {
			const response = await fetch(url);
			const data = await response.json();

			if (!data.items || data.items.length === 0) {
				console.log('No books found');
				return;
			}

			this.displayBooks(data);
			this.startIndex += this.maxResults; // Увеличиваем startIndex для следующего запроса
		} catch (error) {
			console.error('Error fetching books:', error);
		}
	}

	displayBooks(data) {
		if (this.startIndex === 0) {
			this.booksContainer.innerHTML = ''; // Очищаем контейнер только при первом запросе
		}
		data.items.forEach(item => {
			const bookElement = document.createElement('div');
			bookElement.classList.add('item');

			// Создаем элементы и добавляем их в bookElement...
			const imageElement = document.createElement('div');
			imageElement.classList.add('item__image');
			const img = document.createElement('img');
			img.src = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : './images/placeholder.png';
			imageElement.appendChild(img);

			const infoElement = document.createElement('div');
			infoElement.classList.add('item__info');

			const authorElement = document.createElement('p');
			authorElement.classList.add('item__author');
			authorElement.textContent = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author';

			const titleElement = document.createElement('h3');
			titleElement.classList.add('item__title');
			titleElement.textContent = item.volumeInfo.title;

			// Создаем контейнер для рейтинга
			const ratingContainer = document.createElement('div');
			ratingContainer.classList.add('item__rating');

			// Создаем элемент для звезд
			const starsElement = document.createElement('span');
			starsElement.classList.add('item__rating__stars');

			// Создаем элемент для количества оценок
			const countElement = document.createElement('span');
			countElement.classList.add('item__rating__count');
			const ratingsCount = item.volumeInfo.ratingsCount || 0;
			countElement.textContent = ratingsCount + (ratingsCount === 1 ? ' review' : ' reviews');

			// Получаем рейтинг
			const rating = item.volumeInfo.averageRating || 0;
			const fullStars = Math.floor(rating); // Полные звезды
			const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Половинчатая звезда
			const emptyStars = 5 - fullStars - halfStar; // Пустые звезды

			// Добавляем полные звезды
			for (let i = 0; i < fullStars; i++) {
				const star = document.createElement('span');
				star.classList.add('star', 'star-full');
				starsElement.appendChild(star);
			}

			// Добавляем половинчатую звезду
			if (halfStar) {
				const star = document.createElement('span');
				star.classList.add('star', 'star-half');
				starsElement.appendChild(star);
			}

			// Добавляем пустые звезды
			for (let i = 0; i < emptyStars; i++) {
				const star = document.createElement('span');
				star.classList.add('star', 'star-empty');
				starsElement.appendChild(star);
			}

			const descriptionElement = document.createElement('p');
			descriptionElement.classList.add('item__description');
			descriptionElement.textContent = item.volumeInfo.description || 'No description available';

			const priceElement = document.createElement('p');
			priceElement.classList.add('item__price');
			if (item.saleInfo && item.saleInfo.retailPrice) {
				priceElement.textContent = item.saleInfo.retailPrice.amount + ' ' + item.saleInfo.retailPrice.currencyCode;
			} else {
				priceElement.textContent = 'Price not available';
			}

			const button = document.createElement('button');
			button.id = item.id;
			button.textContent = 'Buy now';

			infoElement.appendChild(authorElement);
			infoElement.appendChild(titleElement);
			
			ratingContainer.appendChild(starsElement);
			ratingContainer.appendChild(countElement);

			infoElement.appendChild(ratingContainer);
			
			infoElement.appendChild(descriptionElement);
			infoElement.appendChild(priceElement);
			infoElement.appendChild(button);

			bookElement.appendChild(imageElement);
			bookElement.appendChild(infoElement);

			this.booksContainer.appendChild(bookElement);
		});

		// После добавления книг на страницу, создаем/инициализируем CartManager
		this.initializeCartManager();
	}

	initializeCartManager() {
		if (!this.cartManager) {
			this.cartManager = new CartManager(); // Создаем экземпляр CartManager
		} else {
			this.cartManager.init(); // Повторно инициализируем, если экземпляр уже существует
		}
	}

	fetchFirstBook() {
		const firstLi = this.navContainer.querySelector('li');
		if (firstLi) {
			const url = firstLi.getAttribute('data-url');
			this.fetchBooks(url);
			this.setActiveClass(firstLi);
		}
	}

	LoadMore() {
		this.loadMoreButton.addEventListener('click', () => {
			const activeElement = this.navContainer.querySelector('li.active');
			if (activeElement) {
				const subject = activeElement.getAttribute('data-url');
				this.fetchBooks(subject);
			}
		});
	}
}
