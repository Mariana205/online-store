import CardsList from './cards-list.js';
import Pagination from './pagination.js';
import SideBar from './side-bar.js'
import SearchBox from './search-box.js'
import Basket from './basket.js';

const BACKEND_URL = 'https://online-store.bootcamp.place/api/';

export default class OnlineStorePage {
  constructor() {
    this.pageSize = 9;
    this.productsInBasket = new Map();

    this.createDefaultUrl();

    this.categoriesUrl = new URL('categories', BACKEND_URL);
    this.brandsUrl = new URL('brands', BACKEND_URL);

    this.components = {};

    this.initComponents();
    this.render();
    this.renderComponents();

    this.initEventListeners();
    this.updateCategories();
    this.updateBrands();

    this.loadCardList(1);
    this.addEventListenerBasket();
  }

  getTemplate() {
    return `
    <div class="container">
      <header class="header">
        <div class="logo">Online Store</div>
        <a href="#" class="basket-btn" data-element="basket">
          <i class="bi bi-cart"></i>
          Cart
          <span class="counter-product"></span>
        </a>
      </header>
      <div data-element="modal-basket">
        <!-- Basket -->
      </div>
      <div class="main-page">
        <div data-element="side-bar">
          <!-- Site bar component -->
        </div>
        <div>
          <div data-element="search-box">
            <!-- Search box -->
          </div>
          <div data-element="cards-list">
            <!-- Cards List component -->
          </div>
          <div data-element="pagination">
            <!-- Pagination component -->
          </div>
        </div>
      </div>
    </div>
    `;
  }


  initComponents() {
    const totalElements = 100;
    const totalPages = Math.ceil(totalElements / this.pageSize);

    const cardsList = new CardsList();
    const pagination = new Pagination({
      activePageIndex: 0,
      totalPages
    });
    const sideBar = new SideBar(
      this.categories,
      this.brands
    );
    const searchBox = new SearchBox();


    this.components.searchBox = searchBox;
    this.components.sideBar = sideBar;
    this.components.cardsList = cardsList;
    this.components.pagination = pagination;
  }

  renderComponents() {
    const cardsContainer = this.element.querySelector('[data-element="cards-list"]');
    const paginationContainer = this.element.querySelector('[data-element="pagination"]');
    const sideBarContainer = this.element.querySelector('[data-element="side-bar"]');
    const searchBoxContainer = this.element.querySelector('[data-element="search-box"]');

    cardsContainer.append(this.components.cardsList.element);
    paginationContainer.append(this.components.pagination.element);
    sideBarContainer.append(this.components.sideBar.element);
    searchBoxContainer.append(this.components.searchBox.element);
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  initEventListeners() {
    this.components.pagination.element.addEventListener('page-changed', event => {
      const pageIndex = event.detail;

      this.loadCardList(pageIndex + 1);
    });

    this.components.searchBox.element.addEventListener('search-changed', event => {
      const text = event.detail;

      this.updateByText(text);
    });

    this.components.sideBar.element.addEventListener('range-selected-price', event => {
      const minPrice = event.detail.from;
      const maxPrice = event.detail.to;

      this.updateByPrice(minPrice, maxPrice);
    });

    this.components.sideBar.element.addEventListener('range-selected-star', event => {
      const minStar = event.detail.from;
      const maxStar = event.detail.to;

      this.updateByStar(minStar, maxStar);
    });

    this.components.sideBar.element.addEventListener('select-category', event => {
      const selectCategory = event.detail.id;
      const checked = event.detail.checked;

      this.updateSelectCategory(selectCategory, checked);
    });

    this.components.sideBar.element.addEventListener('select-brands', event => {
      const selectBrands = event.detail.id;
      const checked = event.detail.checked;

      this.updateSelectBrands(selectBrands, checked);
    });

    this.components.sideBar.element.addEventListener('clear-filters', event => {

      this.resetFilters();
    });

    this.components.cardsList.element.addEventListener('add-product', event => {

      this.addProduct(event.detail);
    });
  }

  createDefaultUrl() {
    this.url = new URL('products', BACKEND_URL)
    this.url.searchParams.set('_limit', this.pageSize);
  }

  async loadData(pageNumber) {
    this.url.searchParams.set('_page', pageNumber)
    const response = await fetch(this.url)

    const products = await response.json();
    return products;
  }

  async loadCategories() {
    const response = await fetch(this.categoriesUrl);
    const categories = await response.json();
    return categories;
  }

  async loadBrands() {
    const response = await fetch(this.brandsUrl);
    const brands = await response.json();
    return brands;
  }

  async loadCardList(pageNumber) {
    const data = await this.loadData(pageNumber);

    this.components.cardsList.update(data);
  }

  async updateByText(value) {
    this.url.searchParams.set('q', value);

    this.updateCards();
  }

  async updateByPrice(minPrice, maxPrice) {
    this.url.searchParams.set('price_gte', minPrice);
    this.url.searchParams.set('price_lte', maxPrice);
    this.updateCards();
  }

  async updateByStar(minStar, maxStar) {
    this.url.searchParams.set('rating_gte', minStar);
    this.url.searchParams.set('rating_lte', maxStar);

    this.updateCards();
  }

  async updateCategories() {
    const categories = await this.loadCategories();

    this.components.sideBar.updateCategories(categories);
  }

  async updateBrands() {
    const brands = await this.loadBrands();

    this.components.sideBar.updateBrands(brands);
  }

  snakeCaseString(str) {
    return str && str.toLowerCase().match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      .map(s => s.toLowerCase())
      .join('_');
  }

  async updateSelectCategory(id, checked) {
    const categoryKey = 'category';
    let snakeCaseId = this.snakeCaseString(id);
    if (checked) {
      this.url.searchParams.append(categoryKey, snakeCaseId);
    } else {
      const allCategories = this.url.searchParams.getAll(categoryKey);
      this.url.searchParams.delete(categoryKey);
      for (const categoryItem of allCategories) {
        if (categoryItem !== snakeCaseId) {
          this.url.searchParams.append(categoryKey, categoryItem);
        }
      }
    }

    this.updateCards();
  }

  async updateSelectBrands(id, checked) {
    const brandsKey = 'brand';
    let snakeCaseIdBrand = this.snakeCaseString(id);
    if (checked) {
      this.url.searchParams.append(brandsKey, snakeCaseIdBrand);
    } else {
      const allBrands = this.url.searchParams.getAll(brandsKey);
      this.url.searchParams.delete(brandsKey);
      for (const brandItem of allBrands) {
        if (brandItem !== snakeCaseIdBrand) {
          this.url.searchParams.append(brandsKey, brandItem);
        }
      }
    }
    this.updateCards();
  }

  async resetFilters() {
    this.createDefaultUrl();

    this.updateCards();
  }

  addEventListenerBasket() {
    const searchElement = this.element.querySelector('[data-element="basket"]');

    searchElement.addEventListener('click', event => {

      const basket = new Basket(this.productsInBasket);

      basket.element.addEventListener('change-basket', event => {

        this.updateBasket(event.detail);
      });

      const basketWindow = this.element.querySelector('[data-element="modal-basket"]');

      this.components.basket = basket;
      this.components.basket.element.addEventListener('close-basket', event => {

        this.closeBasketModal();
      });

      basketWindow.innerHTML = '';
      basketWindow.append(basket.element);
      this.updateBasketTotalPrice();
    });

    document.addEventListener('close-basket', event => {

      this.closeBasketModal();
    });
  }

  closeBasketModal() {
    const basketWindow = this.element.querySelector('[data-element="modal-basket"]');
    basketWindow.innerHTML = '';
  }

  addProduct(product) {
    if (this.productsInBasket.has(product)) {
      const count = this.productsInBasket.get(product);
      this.productsInBasket.set(product, count + 1)
    } else {
      this.productsInBasket.set(product, 1);
    }
    this.updateBasketCount();
  }

  updateBasket(item) {

    this.productsInBasket.set(item.product, item.countProduct)
    this.updateBasketCount();
    this.updateBasketTotalPrice();
  }

  updateBasketCount() {
    let sumCount = 0;

    this.productsInBasket.forEach(value => {
      sumCount += value;
    });

    const counterProduct = this.element.querySelector('.counter-product');
    if (sumCount > 0) {
      counterProduct.innerHTML = sumCount;
    } else {
      counterProduct.innerHTML = '';
    }
  }

  updateBasketTotalPrice() {
    let totalPrice = 0;

    for (const item of this.productsInBasket.entries()) {
      const product = item[0];
      const count = item[1];

      totalPrice += product.price * count;
    }
    this.components.basket.updateProductPrice(totalPrice)
  }

  async updateCards() {
    this.url.searchParams.delete('_page');

    const response = await fetch(this.url);
    const products = await response.json();

    this.components.cardsList.update(products);
    const totalElements = Number(response.headers.get('X-Total-Count'));
    this.components.pagination.updatePageCount(totalElements, this.pageSize);
    this.components.pagination.setPage(0);
  }
}
