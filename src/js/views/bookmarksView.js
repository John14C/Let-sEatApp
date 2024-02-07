import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; //parcel2
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkp() {
    //this.data to tablica wiec musimy przejśc po elementach tej tablicy aby każdy móć wypisać
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
