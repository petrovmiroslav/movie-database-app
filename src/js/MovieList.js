import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import MovieItem from './MovieItem';
import Filter from './Filter';
import SortInput from './SortInput';

class MovieList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: props.apiKey,
      moviesData: [],
      sortBy: 'popularity.desc',
      genres: [{"id":28,"name":"боевик"},{"id":12,"name":"приключения"},{"id":16,"name":"мультфильм"},{"id":35,"name":"комедия"},{"id":80,"name":"криминал"},{"id":99,"name":"документальный"},{"id":18,"name":"драма"},{"id":10751,"name":"семейный"},{"id":14,"name":"фэнтези"},{"id":36,"name":"история"},{"id":27,"name":"ужасы"},{"id":10402,"name":"музыка"},{"id":9648,"name":"детектив"},{"id":10749,"name":"мелодрама"},{"id":878,"name":"фантастика"},{"id":10770,"name":"телевизионный фильм"},{"id":53,"name":"триллер"},{"id":10752,"name":"военный"},{"id":37,"name":"вестерн"}],
      selectedGenres: {},
      page: 1,
      total_pages: 1,
      loading: true,
      scrollTrigger: null,
    };
    this.movieListRef = React.createRef();

    this.fetchMovieList = this.fetchMovieList.bind(this);
    this.setupUrl = this.setupUrl.bind(this);
    this.createMovieItems = this.createMovieItems.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
    this.fetchGenres = this.fetchGenres.bind(this);
    this.filterChangeHandler = this.filterChangeHandler.bind(this);
    this.onApplyFilterHandler = this.onApplyFilterHandler.bind(this);
    this.nextPageHandler = this.nextPageHandler.bind(this);
    this.addScrollHandler = this.addScrollHandler.bind(this);
    this.updateScrollListener = this.updateScrollListener.bind(this);
    this.removeScrollListener = this.removeScrollListener.bind(this);
    this.favouriteButtonHandler = this.favouriteButtonHandler.bind(this);
  }

  componentDidMount () {
    // Получить список фильмов
    this.fetchMovieList();
    // Получить список жанров для фильтра
    this.fetchGenres();
    // Добавить обработчик скролла для бесконечной прокрутки
    this.addScrollHandler();
  }
  componentDidUpdate () {
    // Обновить обработчик скрола при изменении списка
    this.updateScrollListener();
  }
  componentWillUnmount () {
    // Удалить обработчик скрола если список не на странице
    this.removeScrollListener();
  }

  fetchMovieList () {
    // Показать индикатор загрузки
    this.setState({
      loading: true,
    });

    fetch(this.setupUrl())
    .then(r => r.json())
    .then(this.fetchMovieListResultHandler.bind(this), 
          this.fetchMovieListErrorHandler.bind(this));
  }

  setupUrl () {
    let vote_count_gte = 1,
        vote_average_gte = 1,
        with_genres = [],
        page = '';

    // При сортировке по рейтингу по убыванию добавить фильтр по минимальному кол-ву оценок
    if (this.state.sortBy === 'vote_average.desc') {
      vote_count_gte = 1000;
      vote_average_gte = 0;
    }

    // Список жанров из фильтра
    for (let id in this.state.selectedGenres) {
      with_genres.push(id);
    }
    with_genres = with_genres.length
                    ? '&with_genres=' + with_genres.join(',')
                    : '';

    // Если нужна следующая страница, добавить номер страницы в запрос
    if (typeof this.state.page !== 'undefined' && this.state.page > 0) {
      page = '&page=' + this.state.page;
    } 

    return 'https://api.themoviedb.org/3/discover/movie?'
    + 'api_key=' + this.state.apiKey
    + '&sort_by=' + this.state.sortBy
    + '&vote_count.gte=' + vote_count_gte
    + '&vote_average.gte=' + vote_average_gte
    + '&release_date.lte=' + Date.now()
    +  with_genres
    +  page
    + '&language=ru'
    + '&include_adult=false&include_video=false';
  }

  fetchMovieListResultHandler (result) {
    // Добавить инфо в избранном или нет, в каждый фильм
    result.results = this.props.favouritesActions.addToData(result.results);

    // Добавить новый список к текущему 
    let page = result.page,
        moviesData = page > 1 
          ? this.state.moviesData.concat(result.results)
          : result.results;

    this.setState({
      moviesData: moviesData,
      page: page,
      total_pages: result.total_pages,
      loading: false,
    });
  }

  fetchMovieListErrorHandler (error) {
    console.log('fetchMovieListErrorHandler', error);
  }

  createMovieItems () {
    let items = this.state.moviesData;

    // Если списка нет, добавить 10 пустых элементов как заглушки
    if (!Array.isArray(items) || !items.length) {
      items = [...Array(10)].map((_, i) => i);
    }

    return items.map((item, index) => {
      return <MovieItem 
      key={item && item.id || index} 
      moviesData={item}
      favouriteButtonHandler={this.favouriteButtonHandler}/>
    }
      
    );
  }

  sortHandler (event) {
    // Установить параметр сортировки и показать первую страницу
    this.setState({
      sortBy: event.target.value,
      page: 1,
    },
    () => this.fetchMovieList() );
  }

  fetchGenres () {
    fetch('https://api.themoviedb.org/3/genre/movie/list?&language=ru&api_key=' + this.state.apiKey)
    .then(r => r.json())
    .then(this.fetchGenresResultHandler.bind(this), 
          this.fetchGenresErrorHandler.bind(this));
  }

  fetchGenresResultHandler (result) {
    this.setState({
      genres: result.genres,
    });
  }

  fetchGenresErrorHandler (error) {
    console.log('fetchGenresErrorHandler', error);
  }

  filterChangeHandler (event) {
    // Обновить чекбокс фильтра жанров и добавить его значение к списку выбранных жанров
    let id = event.target.dataset.id,
        checked = event.target.checked;

    let selectedGenres = {...this.state.selectedGenres};

    checked 
      ? selectedGenres[id] = true
      : delete selectedGenres[id];

    this.setState({
      selectedGenres: selectedGenres,
    });
  }

  onApplyFilterHandler (event) {
    // При нажатии на кнопку применить фильтр сделать запрос с выбранными жанрами
    this.setState({
      page: 1,
    },
    () => this.fetchMovieList() );
  }

  nextPageHandler () {
    // Сделать запрос следующей страницы списка фильмов

    // Если это последняя страница - выйти
    let nextPage = this.state.page + 1;
    if (nextPage > this.state.total_pages) {
      return;
    }
    this.setState({
      page: nextPage,
    },
    () => this.fetchMovieList() );
  }

  addScrollHandler () {
    // Создаем скроллтриггер для бесконечной прокрутки
    let scrollTrigger = ScrollTrigger.create({
      trigger: this.movieListRef.current,
      start: 'bottom bottom',
      onEnter: this.nextPageHandler,
    });

    this.setState({
      scrollTrigger: scrollTrigger,
    });
  }
  updateScrollListener () {
    ScrollTrigger.refresh();
  }
  removeScrollListener () {
    this.state.scrollTrigger.kill();
  }

  favouriteButtonHandler (movieId, isFavourite) {
    // Обработчик кнопки добавить/удалить в избранное
    let data = this.state.moviesData;

    // Добавить инфу в список избранных фильмов
    isFavourite 
      ? this.props.favouritesActions.remove(movieId)
      : this.props.favouritesActions.add(movieId);

    // Добавить инфу в информацию о фильме
    data = this.props.favouritesActions.addToData(data);
    this.setState({
      moviesData: data,
    });
  }

  render () {
    return (
      <section ref={this.movieListRef} className='movie-list'>
        <Filter 
          genres={this.state.genres} 
          selectedGenres={this.state.selectedGenres} 
          changeHadler={this.filterChangeHandler}
          onApplyFilterHandler={this.onApplyFilterHandler}/>

        <SortInput sortBy={this.state.sortBy} sortHandler={this.sortHandler}/>

        {this.state.total_pages === 0 && !this.state.loading
          ? <h3>По вашему запросу ничего не найдено</h3>
          : <div className='movie-items-wrapper'>
              {this.createMovieItems()}
            </div>
        }

        {this.state.loading && <p>Загрузка...</p>}

      </section>
    );
  }
}
export default MovieList;