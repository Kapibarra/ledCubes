document.addEventListener('DOMContentLoaded', () => {
	let orderForm, orderSubmitBtn;

	if ((orderForm = document.querySelector('#order-form')) && (orderSubmitBtn = document.querySelector('.order-body__button'))) {
		orderForm.addEventListener('submit', function(e) {			
			const formData = new FormData(this);
			const params = new URLSearchParams(formData);
			const data = Object.assign(Object.fromEntries(params), {"submit": "order"});

			let ajax = $.ajax({
				url: 'mail_order.php',
				type: 'POST',
				dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
				data: data
			})

			popupMessage('Спасибо за заказ', () => document.location = "/");

			console.log(data)
			orderSubmitBtn.disabled = true;

			setTimeout(() => {
				orderSubmitBtn.disabled = false;
			}, 2000);

			e.preventDefault();
		})

		const observerConfig = {
			attributes: true,
			childList: false,
			subtree: true
		}

		const observerCallback = function (mutationsList, mutation) {
			let disabledElements;

			for (let mutation of mutationsList) {
				if (mutation.type == 'attributes' && mutation.target.classList.contains('order-delivery')) {
					disabledElements = mutation.target.querySelectorAll("[data-disabled]");
					if (mutation.target.classList.contains('order-delivery--active')) {
						disabledElements.forEach(element => element.disabled = false);
					} else {
						disabledElements.forEach(element => element.disabled = true);
					}
				}
			}
		}

		const observer = new MutationObserver(observerCallback);

		observer.observe(orderForm, observerConfig);

		const orderDateWrapper = document.querySelector('.order-date__items');
		const orderDateItems = orderDateWrapper.querySelectorAll('.order-date__item');

		const abbreviations = {
			days : ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
			months : ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
		}

		let date = new Date();
		let currentTime = date.getHours();
		let currentDate = date.getDate();
		let placeholder;

		if (currentTime >= 20) currentDate = currentDate + 1;

		orderDateItems.forEach((item, i) => {
			date.setDate(currentDate + i);
			placeholder = `${date.getDate()} ${abbreviations.months[date.getMonth()]}`;
			item.querySelector('input').value = placeholder;
			item.querySelector('label').innerHTML = `
				${placeholder}
				<span class="order-date__day">${abbreviations.days[date.getDay()]}</span>
			`;
		});
	}
})