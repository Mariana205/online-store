export default class BasketItem {
  constructor(someProduct) {
    this.state = someProduct;
    this.render();
  }

  getTemplate() {
    return `
    <div>
    <div class="cart-list">
      <div class="item-preview">
      <img class="img-basket" src="${this.state.images[0]}">
      </div>
      <div class="item-preview name">${this.state.title}</div>
      <div class="item-preview counter">
        <button class="counter-btn">
          <i class="bi bi-dash-circle"></i>
        </button>
        1
        <button class="counter-btn">
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
      <div class="item-preview price">${this.state.price}</div>
    </div>
  </div>
    `;
  }
  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  update(data = {}) {
    this.state = data;
    this.element.innerHTML = this.getTemplate();
  }
}
