// import icons from '../img.svg';//parcel1
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1); //pobieramy z linku na stronie hash czyli id kazdego przepisu
    //1 loading recepi
    if (!id) return; //Jeżli id nie istnieje to zwraca nic

    //update results view to mark selected seatch result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks); //wyświetlany prszepis tez bedzie zazanczony w bookmarks

    recipeView.renderSpinner(); //generujemy spiner podczaś ładopwonia
    await model.loadRecipe(id); //wywoływanie funkcji z pliku model dzieki czemu mamy nowy obiekt recipe
    //2 render recepie
    recipeView.render(model.state.recipe); //bierzemy nass recipe i wywołujemy z nim funkcje render
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //get search query
    const query = searchView.getQuery(); //wywołujemy funkcje z searchView która pobiera nam wartośc która wpisaliśmy oknie
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query); //następnei na podstawie query wywołujemy funkcje która trzowrzy nam odpowni link i wrzucane dane do obiektu

    //render resoults
    // resultsView.render(model.state.search.results); //generujemy
    resultsView.render(model.getSearchResultsPage());

    //render pagination page
    paginationView.render(model.state.search); //rendeeujemy daną ilość przepisów
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //render new resoults
  // resultsView.render(model.state.search.results); //generujemy
  resultsView.render(model.getSearchResultsPage(goToPage)); //zmieniamy w getSearchResultsPage zmienna na tą do ktej przechodzimy
  //która nam zmienia model.state.search
  //render new pagination page
  paginationView.render(model.state.search); //wygenreują nam sie na tej podstawie nowe przyciwski itp
};

const controlServings = function (newServings) {
  //Update recipe servings(in stae)
  model.updateServings(newServings);
  //Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //wpisuje do tablicy przepis zaznczony
  else model.deleteBookmark(model.state.recipe.id);

  //update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //SHow loadinf spiiner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render new recipe

    recipeView.render(model.state.recipe);

    //display succes message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //

    //close window
    setTimeout(function () {
      //CHWILE CZEKAMY
      addRecipeView.toggleWindow(); //PO NACISNIECU CHWILE CZEAY I ZAMYKAMY OKNO WPROWADZANIA NOWEGO PRZEPISU
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('🧟‍♀️', err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  //public /subscribe method wywołujmey funckje addHanlerrender z argumentem jako funckja którą funcja addHnadlerrender chce wykonać gdy darzą sie dane rzeczu
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddbookmark(controlAddBookmark); //jak naciśniemy bookmarrk to wywołamy controlladdBookmark
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
