import React from 'react';

import MovieItem from './MovieItem';
import Star from './Star';

class MovieItemFull extends MovieItem {
  constructor (props) {
    super(props);
  }

  getOverview () {
    return this.props.moviesData && this.props.moviesData.overview || false;
  }

  getRuntime () {
    return this.props.moviesData && this.props.moviesData.runtime || false;
  }

  getGenres () {
    let genres = this.props.moviesData && Array.isArray(this.props.moviesData.genres) && this.props.moviesData.genres.map(genre => genre.name).join(', ');
    return genres || '';
  }

  getBackdrop () {
    return this.props.moviesData && this.props.moviesData.poster_path && 'https://image.tmdb.org/t/p/w500' + this.props.moviesData.backdrop_path || '';
  }

  render () {
    let posterImgUrl  = this.getPosterUrl(),
        backdropUrl = this.getBackdrop(),
        isFavourite = this.isFavourite();
    
    return (
      <div className='movie-page'>
        { backdropUrl && 
          <div className='movie-page__backdrop'>
            <img src={backdropUrl} alt="poster" className='movie-page__backdrop-img'></img>
          </div>
        }
        <div className='movie-page__poster-wrapper'>
          { posterImgUrl && <img src={posterImgUrl} alt="poster" className='movie-page__img'></img>
          }
        </div>
        <div className='movie-page__content'>
          <h3 className='movie-page__title'>{this.getTitle()}</h3>
          <div className='movie-page__row'>
            <div className='movie-page__left-column'>
              <p className='movie-page__overview'>{this.getOverview()}</p>
              <p>Жанр: {this.getGenres()}</p>
              <p>Продолжительность: {this.getRuntime()} мин</p>
              <p>Дата релиза: {this.getReleaseDate()}</p>
              <p>Рейтинг: {this.getVote()}</p>
            </div>
            <div className='movie-page__right-column'>
              <button className={
                  isFavourite
                    ? 'movie-item__favourite-button movie-page__favourite-button movie-item__favourite-button--is-favourite'
                    : 'movie-page__favourite-button movie-item__favourite-button'} type='button'
                onClick={()=>{this.props.favouriteButtonHandler(this.props.moviesData.id, isFavourite)}}>

                <span className='visually-hidden'>{
                  isFavourite
                    ? 'Добавить в избранное'
                    : 'Удалить из избранного'
                }</span>
                <Star/>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MovieItemFull;