import { elements } from './base';

const renderRecipe = (recipe) => {
   const markup = 
   `<li>
      <a class="results__link" href="#${recipe.recipe_id}">
         <figure class="results__fig">
            <img src=${recipe.image_url} alt=${recipe.title}>
         </figure>
         <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
         </div>
      </a>
   </li>`;
   elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

export const limitRecipeTitle = (title, limit = 17) => {
   const newTitle = [];
   if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
         // console.log(acc);
         if (acc + cur.length < limit) {
            newTitle.push(cur);
         }
         return acc + cur.length;
      }, 0);
      return `${newTitle.join(' ')} ...`;
   }
   return title;
}

// type : 'prev' or 'next'
const createButton = (page, type) => `
   <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page+1}>
      <span>Page ${type === 'prev' ? page-1 : page+1}</span>
      <svg class="search__icon">
         <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left':'right'}"></use>
      </svg>
   </button>
`;

const renderButton = (page, numResults, resPerPage) => {
   const pages = Math.ceil(numResults / resPerPage);
   let markup;

   if (page === 1 && pages > 1) {
      //only one button to go to the next page
      markup = createButton(page, 'next');

   } else if (page < pages) {
      // both button
      markup = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
      `;

   } else if (page === pages && pages > 1) {
      // only button to go to the previous page
      markup = createButton(page, 'prev');
   }
   elements.searchResPage.insertAdjacentHTML('afterbegin', markup);
};

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
   elements.searchInput.value = '';
};

export const clearResults = () => {
   elements.searchResList.innerHTML = '';
   elements.searchResPage.innerHTML = '';
};

export const renderResults = (recipes, page=1, resPerPage=10) => {
   const start = (page - 1) * resPerPage;
   const end = page*resPerPage;
   recipes.slice(start, end).forEach(renderRecipe);
   renderButton(page, recipes.length, resPerPage);
};

export const highlightContant = id => {
   Array.from(document.querySelectorAll('.results__link')).forEach(el => el.classList.remove('results__link--active'));
   const selected = document.querySelector(`.results__link[href*="#${id}"]`)
   if (selected) selected.classList.add('results__link--active');
}