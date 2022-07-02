export default class SearchBox {
  constructor() {
    this.render();
    this.addEventListener();
  }

  getTemplate() {
    const result = `
    <div class="form">
      <input type="text" placeholder="Search" class="form-search" data-element="search-box-input">
      <i class="bi bi-search input-icon"></i>
    </div>
    `;
    return result;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }


  addEventListener() {
    const searchElement = this.element.querySelector('[data-element="search-box-input"]');

    searchElement.addEventListener('keyup', event => {
      const customEvent = new CustomEvent('search-changed', {
        detail: event.target.value
      });
      this.element.dispatchEvent(customEvent);
    });
  }
}
