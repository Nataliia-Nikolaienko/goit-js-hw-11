import axios from 'axios';


export default class NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    
    fetchImages() {
    const URL = 'https://pixabay.com/api/';
    const ACCESS_KEY = '31977290-c776c8f5c96464145496dafee';

    return axios.get(
    `${URL}?key=${ACCESS_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`,
    )
    .then(({data}) => data)
    .then(data => {
        this.incrementPage();

        return data;
    });
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get getQuery() {
        return this.searchQuery;
    }

    set setQuery(newQuery) {
        this.searchQuery = newQuery;
    }
}








