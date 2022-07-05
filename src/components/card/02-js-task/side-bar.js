import Category from "./category.js";
import Brands from "./brands.js";
import DoubleSlider from "./double-slider.js";

export default class SideBar {
  constructor() {

    this.doubleSliderPrice = new DoubleSlider({
      min: 0,
      max: 85000,
      filterName: "price"
    });

    this.doubleSliderStar = new DoubleSlider({
      min: 0,
      max: 5,
      precision: 2,
      filterName: "star"
    });

    this.render();
    this.renderDoubleSliderPrice();
    this.renderDoubleSliderStar();
    this.addEventListenerPrice();
    this.addEventListenerStar();
    this.addEventListenerInputCategories();
    this.addEventListenerInputBrands();
    this.addEventListenerPressBtnClear();
  }

  getTemplate() {
    const result = `
    <div class="wrapper">
  <div class="bar">
    <!-- SideBar component -->
    <div class="wrap-slider slider">
      <h3 class="title-bar">Price</h3>
      <div class="slider" data-element="double-slider-price">
      </div>
      <div class="filters-list">
        <h3 class="title-bar">Category</h3>
        <ul class="list">
          <div data-element="category">
          </div>
        </ul>
      </div>
    </div>
    <div class="wrap-slider filters-list">
      <h3 class="title-bar">Brand</h3>
      <ul class="list">
          <div data-element="brands">
          </div>
      </ul>
    </div>
    <div class="rating">
      <h3 class="title-bar">Rating</h3>
      <div class="slider" data-element="double-slider-star">
      </div>
    </div>
    </div>
    <div class="btn">
      <button class="btn-clear"  data-element="btn-clear">Clear all filters</button>
    </div>
  </div>
    `;

    return result;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  addEventListenerPrice() {
    this.doubleSliderPrice.element.addEventListener('range-selected', event => {
      const customEvent = new CustomEvent('range-selected-price', {
         detail: event.detail.value
      });
      this.element.dispatchEvent(customEvent);
    });
  };

  addEventListenerStar() {
    this.doubleSliderStar.element.addEventListener('range-selected', event => {
      const customEvent = new CustomEvent('range-selected-star', {
         detail: event.detail.value
      });
      this.element.dispatchEvent(customEvent);
    });
  }

  renderCategories() {
    const categories = this.data.map(item => {
      const category = new Category(item);

      return category.element;
    });

    const categoryItem = this.element.querySelector('[data-element="category"]');

    categoryItem.innerHTML = '';
    categoryItem.append(...categories);
  }

  updateCategories(data = []) {
    this.data = data;
    this.renderCategories();
  }

  renderDoubleSliderPrice() {
    const searchElement = this.element.querySelector('[data-element="double-slider-price"]');

    searchElement.innerHTML = '';
    searchElement.append(this.doubleSliderPrice.element);
  }

  renderDoubleSliderStar() {
    const searchElement = this.element.querySelector('[data-element="double-slider-star"]');

    searchElement.innerHTML = '';
    searchElement.append(this.doubleSliderStar.element);
  }

  renderBrands() {
    const brands = this.data.map(item => {
      const brand = new Brands(item);

      return brand.element;
    });

    const brandItem = this.element.querySelector('[data-element="brands"]');

    brandItem.innerHTML = '';
    brandItem.append(...brands);
  }

  updateBrands(data = []) {
    this.data = data;
    this.renderBrands();
  }

  addEventListenerInputCategories() {
    const searchElement = this.element.querySelector('[data-element="category"]');

    searchElement.addEventListener('change', event => {
      const customEvent = new CustomEvent('select-category', {
        detail: {
          id: event.target.id,
          checked: event.target.checked
        }
      });
      this.element.dispatchEvent(customEvent);
    });
  }

  addEventListenerInputBrands() {
    const searchElement = this.element.querySelector('[data-element="brands"]');

    searchElement.addEventListener('change', event => {
      const customEvent = new CustomEvent('select-brands', {
        detail: {
          id: event.target.id,
          checked: event.target.checked
        }
      });
      this.element.dispatchEvent(customEvent);
    });
  }

  clearAllFilters() {
    const allCheckBoxes = this.element.querySelectorAll('input[type=checkbox]');
    const searchElementSearchBox = document.querySelector('[data-element="search-box-input"]');


    this.doubleSliderPrice.reset();
    this.doubleSliderStar.reset();


    searchElementSearchBox.value = "";
    allCheckBoxes.forEach(checkBox => {
      checkBox.checked = false;
    });
  }

  addEventListenerPressBtnClear() {
    const searchElement = this.element.querySelector('[data-element="btn-clear"]');

    searchElement.addEventListener('click', event => {
      this.clearAllFilters();

      const customEvent = new CustomEvent('clear-filters', {
        detail: event.target.value
      });
      this.element.dispatchEvent(customEvent);
    });
  }
}
