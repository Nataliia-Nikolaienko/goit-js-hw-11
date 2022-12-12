import './css/styles.css';
import './style.css';
import Notiflix from 'notiflix';
import NewsApiService from './js/images-service';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
};

const lightbox = new SimpleLightbox('.gallery a', { 
    captionDelay: 250,
 });

const newsApiService = new NewsApiService();

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);


async function onSearch(e) {
    e.preventDefault();
  clearMarkup();
  refs.loadMoreBtn.classList.add('is-hiden');
    newsApiService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();
    newsApiService.resetPage();
    await newsApiService.fetchImages().then(createMarkup).then((data) => {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    })
};

async function onLoadMoreBtn() {
    await newsApiService.fetchImages().then(createMarkup).then((data) => {
        const total = data.totalHits / 40;
      if (newsApiService.page >= total) {
           refs.loadMoreBtn.classList.add('is-hiden');
            return Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        }
        });
        }

function createMarkup(data) {
    if (newsApiService.searchQuery === '') {
        return;
    } else if (data.hits.length === 0) {
        return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    } else {
      const list = data.hits
        .map(
          ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
          }) => {
        return `<a class="gallery-link" href="${largeImageURL}">
  <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</a>`;
    }).join('');
      refs.gallery.insertAdjacentHTML('beforeend', list);
      if (data.total <= 40) {
        lightbox.refresh();
        return data;
      } else {
        refs.loadMoreBtn.classList.remove('is-hiden');
      }
      lightbox.refresh();
      return data;     
};
    }


function clearMarkup() {
    refs.gallery.innerHTML = '';
};


