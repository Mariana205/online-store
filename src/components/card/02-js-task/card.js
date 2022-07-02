export default class Card {
  constructor(someProduct) {
    this.state = someProduct;
    this.myRender();
    this.addEventListenerCloseBasket();
  }

  getTemplate() {
    const result = `
      <div class="wrapper">
      <div class="card-list">
        <div class="card">

          <div class="img" style="background-image: url(${this.state.images[0]})">
          </div>
          <div class="about">
            <div class="price-star">
              <div class="star">
                <p class="rating">${this.state.rating}</p>
                <i class="bi bi-star"></i>
              </div>
            <div>${this.state.price}</div>
            </div>
            <div class="name-laptops">${this.state.title}</div>
            <div class="class-computer">${this.state.category}</div>
          </div>
          <footer class="btn">
            <button class="name-btn" data-element="btn-add-product">add to card</button>
          </footer>
        </div>
      </div>
      </div>
    `;

    return result;
  }

  update(data = {}) {
    this.state = data;
    this.element.innerHTML = this.getTemplate();
  }

  myRender() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  addEventListenerCloseBasket() {
    const searchElement = this.element.querySelector('[data-element="btn-add-product"]');

    searchElement.addEventListener('click', event => {
      const customEvent = new CustomEvent('add-product', {
        detail: this.state
      });
      this.element.dispatchEvent(customEvent);
    });
  }
}
