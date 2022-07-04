export default class BasketItem {
  constructor(product, count) {
    this.product = product;
    this.count = count;
    this.render();
    this.removeProductCount();
    this.addProductCount();
  }

  getTemplate() {
    return `
    <div>
    <div class="cart-list">
      <div class="item-preview">
      <img class="img-basket" src="${this.product.images[0]}">
      </div>
      <div class="item-preview name">${this.product.title}</div>
      <div class="item-preview counter">
        <button class="counter-btn minusCount">
          <i class="bi bi-dash-circle"></i>
        </button>
        <span class="product-count" data-element="product-element-count">${this.count}</span>
        <button class="counter-btn plusCount">
          <i class="bi bi-plus-circle"></i>
        </button>
      </div>
      <div class="item-preview price" data-element="total-price">${this.product.price * this.count}</div>
    </div>
  </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  updateCountProductElement() {
    const elementCount = this.element.querySelector('[data-element="product-element-count"]');
    const elementTotalPrice = this.element.querySelector('[data-element="total-price"]');
    if (this.count > 0) {
      elementCount.innerHTML = this.count;
      elementTotalPrice.innerHTML = this.count * this.product.price;
    } else {
      this.element.innerHTML = '';
    }
    const customEvent = new CustomEvent('change-basket', {
      detail: {
        countProduct: this.count,
        product: this.product
      }
    });
    this.element.dispatchEvent(customEvent);
  }

  removeProductCount() {
    const minusCount = this.element.querySelector('.minusCount');
    minusCount.addEventListener('click', event => {
      this.count -= 1;
      this.updateCountProductElement();
    });
  }

  addProductCount() {
    const plusCount = this.element.querySelector('.plusCount');
    plusCount.addEventListener('click', event => {
      this.count += 1;
      this.updateCountProductElement();
    });
  }

}
