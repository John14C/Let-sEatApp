import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { AJAX, sendJSON } from './helpers';
import { AJAX } from './helpers';

import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data; //w obiekcie data, który ma obiekt data zmieniemay zmienna recepie
  return {
    //zmeiniemy ten obiekt
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //jeżeli recipe. key istanieje to return  { key: recipe.key }(czyli tworzymy nowy obiekt w naszym obiekcie recipe)
    //i na koncu wywalamy z niego wartosci ...
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true; //sprawdzamy czy bookmark ktory ładujemy istanieje już jako zazanczony, jeśli tak to niehc bedzie zaznaczony a jak nie to nie
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 😶‍🌫️😶‍🌫️😶‍🌫️`);
    throw err; //nie dokonca wiem czemu ale dzieki temu
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      //wrzucamy do obkieu state dane odnosnie wyszukiwania
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; //zawsze po załdanowiu nowego słowa ustawiamy  1 strone
  } catch (err) {
    console.error(`${err} 😶‍🌫️😶‍🌫️😶‍🌫️`);
    throw err; //nie dokonca wiem czemu ale dzieki temu
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0 ;
  const end = page * state.search.resultsPerPage; //0;
  return state.search.results.slice(start, end); //Zostawiamy na pierwszej stronie tylko 10 wyników
};

export const updateServings = function (newSerwings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newSerwings) / state.recipe.servings;
    //newQt = oldQt * newServings/ old servings
  });
  state.recipe.servings = newSerwings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add bookmarks
  state.bookmarks.push(recipe);

  //mark Current recipe as bookmark
  //jezeli przesłane id jest takie jak current
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id == id); //szukamy id który jest tym id w naszej tablicy
  state.bookmarks.splice(index, 1); // od teog modelu uuswamy jeden

  if (id === state.recipe.id) state.recipe.bookmarked = false; //oznaczmy jako nieoznaczony
  persistBookmarks();
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//jakbysmy chcieli szynklo uusnąc wszytsko
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(','); //pierwzy elemnet ma zaczynac sie od ingredient a drugi pownien istnieć
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format '
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : 0, unit, description }; //
      });
    const recipe = {
      //tworzymy nowy obiket recipe który wygląda jak ten który jest z api/ trozwymy go na podstawie wpisanych w wartości w tworzeniu przepisu
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //Wysyłamy do api ale rówżniez  zawraca nam gotowy api z nowym
    state.recipe = createRecipeObject(data); //tworzymy z tego taki sam plik jak z api domyślnie
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
