import Category from "./category.js";
import Brands from "./brands.js";

export default class SideBar {
  constructor() {
    this.render();
    this.addEventListenerMinPrice();
    this.addEventListenerMaxPrice();
    this.addEventListenerMaxStar();
    this.addEventListenerMinStar();
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
      <div class="slider">
        <div slider class="slider-distance">
          <div>
            <div inverse-left style="width:70%;"></div>
            <div inverse-right style="width:70%;"></div>
            <div range style="left:0%;right:0%;"></div>
            <span thumb style="left:0%;"></span>
            <span thumb class="max-thumb" style="left:100%;"></span>
            <div sign style="left:0%;">
              <span class="value left">0 <label for="value">UAH</label></span>
            </div>
            <div sign style="left:100%;">
              <span class="value right">85000 <label for="value">UAH</label></span>
            </div>
          </div>
          <input type="range" class="min" data-element="min-price" value="0" max="85000" min="0" step="1" oninput="
              this.value=Math.min(this.value,this.parentNode.childNodes[5].value-1);
              let value = (this.value/parseInt(this.max))*100
              var children = this.parentNode.childNodes[1].childNodes;
              children[1].style.width=value+'%';
              children[5].style.left=value+'%';
              children[7].style.left=value+'%';children[11].style.left=value+'%';
              children[11].childNodes[1].innerHTML=this.value;" />

          <input type="range" class="max" data-element="max-price" value="85000" max="85000" min="0" step="1" oninput="
            this.value=Math.max(this.value,this.parentNode.childNodes[3].value-(-1));
            let value = (this.value/parseInt(this.max))*100
            var children = this.parentNode.childNodes[1].childNodes;
            children[3].style.width=(100-value)+'%';
            children[5].style.right=(100-value)+'%';
            children[9].style.left=value+'%';children[13].style.left=value+'%';
            children[13].childNodes[1].innerHTML=this.value;" />
        </div>
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
      <div class="slider">
        <div slider class="slider-distance">
          <div>
            <div inverse-left style="width:70%;"></div>
            <div inverse-right style="width:70%;"></div>
            <div range style="left:0%;right:0%;"></div>
            <span thumb style="left:0%;"></span>
            <span thumb class="max-thumb" style="left:100%;"></span>
            <div sign style="left:0%;">
              <span class="value left">0</span>
            </div>
            <div sign style="left:100%;">
              <span class="value right">5</span>
            </div>
          </div>
          <input type="range" class="min" data-element="min-star" value="0" max="5" min="0" step="0.01" oninput="
    this.value=Math.min(this.value,this.parentNode.childNodes[5].value-(-1));
    let value = (this.value/parseInt(this.max))*100
    var children = this.parentNode.childNodes[1].childNodes;
    children[1].style.width=value+'%';
    children[5].style.left=value+'%';
    children[7].style.left=value+'%';children[11].style.left=value+'%';
    children[11].childNodes[1].innerHTML=this.value;" />

          <input type="range" class="max" data-element="max-star" value="5" max="5" min="0" step="0.01" oninput="
    this.value=Math.max(this.value,this.parentNode.childNodes[3].value-(1));
    let value = (this.value/parseInt(this.max))*100
    var children = this.parentNode.childNodes[1].childNodes;
    children[3].style.width=(100-value)+'%';
    children[5].style.right=(100-value)+'%';
    children[9].style.left=value+'%';children[13].style.left=value+'%';
    children[13].childNodes[1].innerHTML=this.value;" />
        </div>
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

  addEventListenerMinPrice() {
    const searchElement = this.element.querySelector('[data-element="min-price"]');

    searchElement.addEventListener('change', event => {
      const customEvent = new CustomEvent('min-price-changed', {
        detail: event.target.value
      });
      this.element.dispatchEvent(customEvent);
    });
  }

  addEventListenerMaxPrice() {
    const searchElement = this.element.querySelector('[data-element="max-price"]');

    searchElement.addEventListener('change', event => {
      const customEvent = new CustomEvent('max-price-changed', {
        detail: event.target.value
      });
      this.element.dispatchEvent(customEvent);
    });
  }

  addEventListenerMinStar() {
    const searchElement = this.element.querySelector('[data-element="min-star"]');

    searchElement.addEventListener('change', event => {
      const customEvent = new CustomEvent('min-star-changed', {
        detail: event.target.value
      });
      this.element.dispatchEvent(customEvent);
    });
  }

  addEventListenerMaxStar() {
    const searchElement = this.element.querySelector('[data-element="max-star"]');

    searchElement.addEventListener('change', event => {
      const customEvent = new CustomEvent('max-star-changed', {
        detail: event.target.value
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
    // const searchElement = this.element.querySelector('[data-element="min-star"]');
    const allCheckBoxes = this.element.querySelectorAll('input[type=checkbox]');
    const searchElementSearchBox = document.querySelector('[data-element="search-box-input"]');

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
