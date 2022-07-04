export default class Pagination {
  constructor({
    activePageIndex = 0,
    totalPages = 0
  } = {}) {
    this.activePageIndex = activePageIndex;
    this.totalPages = totalPages;

    this.render();
    this.addEventListener();
    this.addPageEventListener();
  }

  getTemplate() {
    return `
    <div class="wrapper-paginator">
      <div class="paginator">
        <div class="page vector" data-element="nav-prev">
          <i class="bi bi-chevron-left"></i>
        </div>
        <div data-element="pagination1">
        ${this.getPages()}
        </div>
        <div class="page vector" data-element="nav-next">
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
    </div>
    `;
  }

  getPages() {

    if (this.totalPages === 0) {
      return 'No pagination';
    }

    return `
      <div class="wrapper-paginator" data-element="pagination">
      ${new Array(this.totalPages).fill(1).map( (item, index) => {
        return this.getPageTemplate(index);
      }).join('')}
      </div>
    `;
  }

  getPageTemplate(pageIndex = 0) {
    const isActive = pageIndex === this.activePageIndex ? 'active' : '';

    return `
    <div class="page ${isActive}" data-element="page-link" data-page-index="${pageIndex}">${pageIndex + 1}</div>
    `
  }


  setPage(pageIndex = 0) {
    if (pageIndex === this.activePageIndex) return;
    if (pageIndex > this.totalPages - 1 || pageIndex < 0) return;

    this.dispatchEvent(pageIndex);

    const activePage = this.element.querySelector('.page.active');

    if (activePage) {
      activePage.classList.remove('active');
    }

    const nextActivePage = this.element.querySelector(`[data-page-index="${pageIndex}"]`);

    if (nextActivePage) {
      nextActivePage.classList.add('active');
    }

    this.activePageIndex = pageIndex;
  }


  nextPage() {
    const nextPageIndex = this.activePageIndex + 1;

    this.setPage(nextPageIndex);

  }

  prevPage() {
    const prevPageIndex = this.activePageIndex - 1;

    this.setPage(prevPageIndex);
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = '';
    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  addPageEventListener() {
    const pagesList = this.element.querySelector('[data-element="pagination"]');

    pagesList.addEventListener('click', event => {
      const pageItem = event.target.closest('.page');

      if (!pageItem) return;

      const {
        pageIndex
      } = pageItem.dataset;

      this.setPage(parseInt(pageIndex, 10));
    });
  }

  addEventListener() {
    const prevPageBtn = this.element.querySelector('[data-element="nav-prev"]');
    const nextPageBtn = this.element.querySelector('[data-element="nav-next"]');


    prevPageBtn.addEventListener('click', event => {
      this.prevPage();
    });

    nextPageBtn.addEventListener('click', event => {
      this.nextPage();
    });
  }

  dispatchEvent(pageIndex) {
    const customEvent = new CustomEvent('page-changed', {
      detail: pageIndex
    });
    this.element.dispatchEvent(customEvent);
  }

  updatePageCount(totalElements, pageSize) {
    const totalPages = Math.ceil(totalElements / pageSize);
    this.activePageIndex = 0;
    this.totalPages = totalPages;
    if (totalPages <= 0) {
      this.totalPages = 0
    }

    this.renderPagination();
  }

  renderPagination() {
    const pagesList = this.element.querySelector('[data-element="pagination1"]');

    pagesList.innerHTML = ''
    pagesList.innerHTML = this.getPages();
    this.addPageEventListener();
  }
}
