import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import MovieItemFull from './MovieItemFull';

class MovieDescription extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      apiKey: props.apiKey,
      moviesData: [],
      loading: true,
    }

    this.fetchMovieData = this.fetchMovieData.bind(this);
    this.favouriteButtonHandler = this.favouriteButtonHandler.bind(this);
  }

  componentDidMount () {
    // Запрос информации о фильме
    this.fetchMovieData();
  }

  fetchMovieData () {
    // Показать индикатор загрузки
    this.setState({
      loading: true,
    });

    fetch(`https://api.themoviedb.org/3/movie/${this.props.movieIid}?api_key=${this.props.apiKey}&language=ru`)
    .then(r => r.json())
    .then(this.fetchMovieDataResultHandler.bind(this), 
          this.fetchMovieDataErrorHandler.bind(this));
  }

  fetchMovieDataResultHandler (result) {
    // Добавить инфо в избранном или нет, в каждый фильм
    result = this.props.favouritesActions.addToData(result);

    this.setState({
      moviesData: result,
      loading: false,
    });
  }

  fetchMovieDataErrorHandler (error) {
    console.log('fetchMovieDataErrorHandler', error);
  }

  favouriteButtonHandler (movieId, isFavourite) {
    let data = this.state.moviesData;
    isFavourite 
      ? this.props.favouritesActions.remove(movieId)
      : this.props.favouritesActions.add(movieId);
    data = this.props.favouritesActions.addToData(data);
    this.setState({
      moviesData: data,
    });
  }

  render () {
    return (
      <MovieItemFull 
        moviesData={this.state.moviesData}
        favouriteButtonHandler={this.favouriteButtonHandler}/>
    );
  }
}
export default MovieDescription;