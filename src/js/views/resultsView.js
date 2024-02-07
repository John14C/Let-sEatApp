import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg'; //parcel2
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query!';
  _message = '';

  _generateMarkp() {
    //this.data to tablica wiec musimy przejśc po elementach tej tablicy aby każdy móć wypisać
    return this._data.map(result => previewView.render(result, false)).join(''); //geeneruujmey marakupp z preview view
  }
}
export default new ResultsView();
