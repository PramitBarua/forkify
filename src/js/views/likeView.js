import { elements } from './base'
import { limitRecipeTitle } from './searchView'

export const renderLikes = like => {
    const markup = `
    <li class data-likeid=${like.id}>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src=${like.img} alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;
    elements.likeList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    console.log(id);
    const like = document.querySelector(`[data-likeid="${id}"]`);
    if (like) like.parentElement.removeChild(like);
};

export const changeLoveIcon = isliked => {
    const iconString = isliked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikesMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};