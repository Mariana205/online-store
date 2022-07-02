export default class Brand {
  constructor(someBrand) {

    this.brand = someBrand;
    this.render();
  }

  getTemplate() {
    return `

      <li class="form" data-element="brands">
        <input type="checkbox" class="vehicle-tape"  id="${this.brand}" name="vehicle">
        <label for="vehicle" class="label">${this.brand}</label>
      </li>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }
}
