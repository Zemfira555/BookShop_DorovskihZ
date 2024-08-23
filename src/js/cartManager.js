export default class CartManager {
	constructor() {
		this.init(); // Инициализируем cartManager сразу при создании
	}

	init() {
		// Обновляем список кнопок "Buy now"
		this.cartButtons = Array.from(document.querySelectorAll('#books .item button'));
		if (this.cartButtons.length === 0) {
			console.error('No "Buy now" buttons found. Check your selectors.');
		} else {
			console.log(`Found ${this.cartButtons.length} "Buy now" buttons.`);
		}

		// Получаем список товаров из localStorage
		const items = this.getItemsFromLocalStorage();
		console.log('Items from localStorage:', items);

		// Обновляем текст кнопок, если товар уже есть в корзине
		items.forEach(item => {
			const button = document.getElementById(item.id);
			if (button) {
				button.textContent = 'In the cart';
			} else {
				console.warn(`Button with ID ${item.id} not found.`);
			}
		});

		// Устанавливаем content в псевдоклассе ::before кнопки #cart
		this.updateCartCounter();

		// Добавляем обработчики событий для всех кнопок "Buy now"
		this.cartButtons.forEach(button => {
			const itemElement = button.closest('.item');
			if (!itemElement) {
				console.error('Item element not found for button:', button);
				return;
			}
			const itemId = button.id;
			const author = itemElement.querySelector('.item__author').textContent;
			const title = itemElement.querySelector('.item__title').textContent;

			if (!itemId || !author || !title) {
				console.error('Missing data for button:', button);
				return;
			}

			this.addItemButtonListener(button, itemId, author, title);
		});
	}

	getItemsFromLocalStorage() {
		// Получаем товары из localStorage или возвращаем пустой массив, если таких товаров нет
		try {
			const items = JSON.parse(localStorage.getItem('cartItems')) || [];
			return items;
		} catch (error) {
			console.error('Error parsing localStorage data:', error);
			return [];
		}
	}

	saveItemsToLocalStorage(items) {
		// Сохраняем обновленный список товаров в localStorage
		try {
			localStorage.setItem('cartItems', JSON.stringify(items));
		} catch (error) {
			console.error('Error saving items to localStorage:', error);
		}
	}

	updateCartCounter() {
		// Обновляем счетчик товаров в корзине на кнопке "Cart"
		const items = this.getItemsFromLocalStorage();
		const itemCount = items.length;

		console.log(`Updating cart counter. Items in cart: ${itemCount}`);

		const cartButton = document.getElementById('cart');
		if (cartButton) {
			cartButton.style.setProperty('--cart-item-count', `"${itemCount}"`);
			// Изменяем видимость псевдоэлемента ::before в зависимости от itemCount
			if (itemCount > 0) {
				cartButton.style.setProperty('--cart-before-visibility', 'visible');
			} else {
				cartButton.style.setProperty('--cart-before-visibility', 'hidden');
			}
		} else {
			console.error('Cart button with ID "cart" not found.');
		}
	}

	toggleItemInCart(button, itemId, author, title) {
		// Получаем текущий список товаров
		const items = this.getItemsFromLocalStorage();
		console.log('items before toggle:', items);

		// Проверяем, есть ли товар в корзине
		const itemIndex = items.findIndex(item => item.id === itemId);

		if (itemIndex === -1) {
			// Если товара нет, добавляем его в корзину
			items.push({ id: itemId, author, title });
			button.textContent = 'In the cart';
		} else {
			// Если товар уже в корзине, удаляем его
			items.splice(itemIndex, 1);
			button.textContent = 'Buy now';
		}

		// Сохраняем обновленный список в localStorage и обновляем счетчик
		this.saveItemsToLocalStorage(items);
		this.updateCartCounter();

		console.log('items after toggle:', items); // Проверка работы toggle
	}

	addItemButtonListener(button, itemId, author, title) {
		// Добавляем обработчик событий на кнопку "Buy now"
		button.addEventListener('click', () => {
			console.log(`Button clicked: ${itemId}`);
			this.toggleItemInCart(button, itemId, author, title);
		});
	}
}
