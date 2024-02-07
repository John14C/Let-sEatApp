import View from './View';
import icons from 'url:../../img/icons.svg'; //parcel2
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); //szuka w drzerwie dziedziczenie parentów czyli naszego przycisku, bo elemnet strzałki lub liczby moze byc naciśniety a to też jest w przuciku, gdyby nie to to by nie zadziałało
      if (!btn) return;
      const goToPage = +btn.dataset.goto; // to zmienna która mówi gdzie teraz mamy przejśc
      handler(goToPage);
    });
  }
  _generateMarkp() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); //liczba przepisów przez liczbe przepisó na strone;
    /// page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      // data-goto="${curPage + 1} to zmienna która mówi gdzie teraz mamy przejśc
      return `  
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>`;
    }
    //other page
    if (curPage < numPages) {
      return `<button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
  </button>
  <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    return '';
    //page 1 and there are no other pages
  }
}

export default new PaginationView();
