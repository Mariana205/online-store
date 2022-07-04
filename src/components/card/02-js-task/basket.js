import BasketItem from "./basket-item.js";

export default class Basket {
  constructor(data = []) {
    this.data = data;
    this.render();
    this.renderCards();
    this.addEventListenerCloseBasket();
  }

  getTemplate() {
    return `
    <div class="root" data-element="basket-item">
      <div class="cart">
        <div class="close" data-element="btn-basket-close">
          <i class="bi bi-x-lg"></i>
        </div>
        <div data-element="card-list-basked"></div>
        <div class="total">Total:<span class="total-price"></span></div>
        <div class="order">
        <a href="https://t.me/maryanka205" target="_blank">
        <button class="btn-order"> Order</button>
        </a>
        </div>
      </div>
      </div>
    `;
  }
  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  addEventListenerCloseBasket() {
    const searchElement = this.element.querySelector('[data-element="btn-basket-close"]');

    searchElement.addEventListener('click', event => {
      const customEvent = new CustomEvent('close-basket');
      this.element.dispatchEvent(customEvent);
    });

    window.onclick = (event) => {
      const rootElement = document.querySelector('[data-element="basket-item"]');

      if (event.target == rootElement) {
        const customEvent = new CustomEvent('close-basket');
        document.dispatchEvent(customEvent);
      }
    }
  }

  renderCards() {
    const cards = [];

    for (const item of this.data.entries()) {
      const product = item[0];
      const count = item[1];
      if (count < 1) {
        continue;
      }

      const basketItem = new BasketItem(product, count);
      cards.push(basketItem.element);

      basketItem.element.addEventListener('change-basket', event => {
        const customEvent = new CustomEvent('change-basket', {
          detail: event.detail
        });

        this.element.dispatchEvent(customEvent);
      });

    }
    const cardListBasket = this.element.querySelector('[data-element="card-list-basked"]');


    cardListBasket.innerHTML = '';
    cardListBasket.append(...cards);
  }

  updateProductPrice(totalPrice) {
    const totalPriceBasket = this.element.querySelector('.total-price');
    totalPriceBasket.innerHTML = totalPrice;
  }

}
