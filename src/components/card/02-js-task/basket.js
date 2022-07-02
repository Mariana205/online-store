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
        <div class="total">Total: 111997</div>
        <div class="order">
        <button class="btn-order">Order</button>
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
    const cards = this.data.map(item => {
      const card = new BasketItem(item);

      return card.element;
    });

    const cardListBasket = this.element.querySelector('[data-element="card-list-basked"]');

    cardListBasket.innerHTML = '';
    cardListBasket.append(...cards);
  }
}
