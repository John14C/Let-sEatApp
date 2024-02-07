import icons from 'url:../../img/icons.svg'; //parcel2

export default class View {
  //to jest klasa która zawiera wszystkie najpotrzebniuejsze metody, któtch używają inne metody
  _data; //będziemy z tego korzytsać  w innych views które dziedziczą z View
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data; //teraz nasze dane o przepisie z data wrzucamy do this.data
    const markup = this._generateMarkp(); //wywołu_emy nasz html z danymi

    if (!render) return markup;

    this._clear(); //wywołujemy funckje któa czyści html
    this._parentElement.insertAdjacentHTML('afterbegin', markup); //i wruzcamy go do html
  }

  update(data) {
    //CHcemy stowrzyć nowy markup ale nie chcemt go renderowac, wydenerujemy go tylko i porównamy go z istniejacym markupem i na tej podstawie dodamy lub zmieniemy pewne atrybuty
    this._data = data; //teraz nasze dane o przepisie z data wrzucamy do this.data
    const newMarkup = this._generateMarkp(); //wywołu_emy nasz html z danymi, tu nasz markup to string a nasz current markup jest w dom
    //weic żeby porównać je musimy nowy markup wrzucic do dom
    const newDom = document.createRange().createContextualFragment(newMarkup);

    //zmieniamy notelist na tablice
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // pobieramy z dom wszytsko o recipe

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Update changed text
      if (
        !newEl.isEqualNode(curEl) && //powrónuje new el i curel
        newEl.firstChild?.nodeValue.trim() !== '' //tylko tekst
      ) {
        curEl.textContent = newEl.textContent; //zmienimay tylko teskt w markup czyli takie rzeczy jak ilośc czegos itp
      }
      //Update changed attributs
      if (!newEl.isEqualNode(curEl))
        //zamieniamy attrybuty w curEL na parametry z new el
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = ` 
        <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    //Jeśli nic nie zostało przesłane to będzie to tak z góry
    const markup = `
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    //Jeśli nic nie zostało przesłane to będzie to tak z góry
    const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
        </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
