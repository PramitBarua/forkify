import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import { elements, renderLoader, removeLoader} from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likeView from "./views/likeView";

/**global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - liked recipes
*/

const state = {};

// window.state = state;

async function controlSearch() {
	// 1. get query from view
	const query = searchView.getInput();

	if (query) {
      // 2. new search object is added to the state
      state.search = new Search(query);

      // 3. prepare UI for results
      searchView.clearInput();

      // 4 clear previous results from the UI
      searchView.clearResults();

      renderLoader(elements.searchRes);

      try {
         // 5, search for new recipes
         await state.search.getResults();
         
         removeLoader();
         // 5. render the new result on UI
         // console.log(state.search.result);
         searchView.renderResults(state.search.result);
      } catch(error) {
         alert('something went wrong with the search...');
         removeLoader();
      }
	}	
}

// add event listener for search buton
elements.searchForm.addEventListener('submit', event => {
   event.preventDefault();
   controlSearch();
});

// add event listener to nevigate search results
elements.searchResPage.addEventListener('click', event => {
   let btn = event.target.closest('.btn-inline');
   if (btn) {
      searchView.clearResults();
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.renderResults(state.search.result, goToPage);
      // console.log(goToPage);
   }
});

/**
 * recipe controller
 */

async function controlRecipe() {
   const id = window.location.hash.replace('#', '');
   // console.log(id);

   if (id) {
      // prepare UI for change
      recipeView.clearRecipe();

      // create new recipe object
      state.recipe = new Recipe(id);
      if (state.search) searchView.highlightContant(id);
      try {
         // get recipe data
         await state.recipe.getRecipe();
         
         // calculate the time and servings
         state.recipe.calcTime();
         state.recipe.calcServings();         
         state.recipe.parseIngredients();
         
         // render the recipe
         recipeView.renderRecipe(
            state.recipe,
            state.like.isliked(id)
         );
      } catch(error) {
         console.log(error);
         alert('Error processing recipe!!!');
      }
   }
}

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', () => {
   state.like = new Likes();

   // restore likes
   state.like.readStorage();

   // toggle like manu button
   likeView.toggleLikesMenu(state.like.getNumLikes());

   //render the existing likes
   state.like.likes.forEach(like => likeView.renderLikes(like));

   // load recipe if url contains hash
   controlRecipe();
});

//handle recipe buttons (increase, decrease, like and add shopping list) click
elements.recipe.addEventListener('click', e => {
   console.log('in recipe add listener');
   if (e.target.matches('.recipe__increase, .recipe__increase *')) {
      // increase the servings
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);

   } else if (e.target.matches('.recipe__decrease, .recipe__decrease *')) {
      // decrease the servings
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);

   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
      // make the recipe like or dislike
      controlLikes();

   } else if (e.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
      // add ingredient to the shopping list
      controlList();
   }
});

/**
 * like controller
 */

function controlLikes() {
   // create new like of there is no like yet
   if (!state.like) state.like = new Likes();
   const currentID = state.recipe.ID;
  
   // user have not yet liked current recipe
   if (!state.like.isliked(currentID)){
      // add like to the state
      const likeRecipe = state.like.addLike(
         currentID, 
         state.recipe.title,  
         state.recipe.author, 
         state.recipe.img
      );
      
      // toggle the like button
      likeView.changeLoveIcon(true);
      
      // add like to UI list
      likeView.renderLikes(likeRecipe);
  
      // user liked current recipe
   } else {
      // remove like to the state
      state.like.deleteLike(currentID);

      // toggle the like button
      likeView.changeLoveIcon(false);
      
      // remove like to UI list
      likeView.deleteLike(currentID);
   }
   likeView.toggleLikesMenu(state.like.getNumLikes())
}

/**
 * list controller
 */

function controlList() {
   // create new list of there is no list yet
   if (!state.list) state.list = new List();

   // add list item
   state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient);
      listView.renderShopping(item);
   });  
}


// handle shopping list
['input', 'click'].forEach(event => {
   elements.shoppingList.addEventListener(event,  e => {
      // console.log(e);
      const itemId = e.target.closest('.shopping__item').dataset.itemid;
      console.log(itemId);
      if (e.target.matches('.shopping__delete, .shopping__delete *')) {
         state.list.deleteItem(itemId);
         listView.deleteItem(itemId);
      } else if (e.target.matches('.shopping__count-value')) {
         const value = parseFloat(e.target.value, 10);
         state.list.updateCount(itemId, value);
      }
   })
});

