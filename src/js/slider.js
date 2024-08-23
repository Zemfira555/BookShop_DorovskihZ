export default class Slider {
	constructor(sliderSelector, bulletSelector, interval) {
		this.slides = document.querySelectorAll(sliderSelector);
		this.bullets = document.querySelectorAll(bulletSelector);
		this.currentSlide = 0;
		this.interval = interval;
		this.autoSlideInterval = null;

		this.init();
	}

	init() {
		this.slides.forEach((slide, index) => {
			if (index !== this.currentSlide) {
				slide.classList.add('hidden');
			}
		});

		this.bullets.forEach((bullet, index) => {
			bullet.addEventListener('click', () => {
				this.stopAutoSlide(); // Останавливаем автоматическое пролистывание
				this.showSlide(index); // Показываем выбранный слайд
				this.startAutoSlide(); // Возобновляем автоматическое пролистывание
			});
		});
	
	this.bullets[this.currentSlide].classList.add('active');
	
		this.startAutoSlide();
	}

	showSlide(index) {
		if (index === this.currentSlide) return;

		this.slides[this.currentSlide].classList.add('hidden');
		this.slides[index].classList.remove('hidden');

		this.bullets[this.currentSlide].classList.remove('active');
		this.bullets[index].classList.add('active');

		this.currentSlide = index;
	}

	startAutoSlide() {
		this.autoSlideInterval = setInterval(() => {
			let nextSlide = (this.currentSlide + 1) % this.slides.length;
			this.showSlide(nextSlide);
		}, this.interval);
	}

	stopAutoSlide() {
		if (this.autoSlideInterval) {
			clearInterval(this.autoSlideInterval);
			this.autoSlideInterval = null;
		}
	}
}
