export default class Category {
  constructor(someCategory) {

    this.category = someCategory;
    this.render();
  }

  getTemplate() {
    return `

      <li class="form" data-element="category" >
        <input type="checkbox" class="vehicle-tape" id="${this.category}" name="vehicle">
        <label for="vehicle" class="label">${this.category}</label>
      </li>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }
}
