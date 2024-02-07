class searchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value; // bierzemy wartość tego co wpialiśmy w search
    this._clearInput(); //po wprowdzeniu i zateridzeniu usuwamy to co było wpisane
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    //publisher publikuje swoja metode
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
