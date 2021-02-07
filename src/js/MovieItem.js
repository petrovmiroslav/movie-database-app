import React from 'react';
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import Star from './Star';

class MovieItem extends React.Component {
  constructor (props) {
    super(props);
  }

  getPosterUrl () {
    return this.props.moviesData && this.props.moviesData.poster_path && 'https://image.tmdb.org/t/p/w500' + this.props.moviesData.poster_path || '';
  }

  getTitle () {
    return this.props.moviesData && this.props.moviesData.title || 'Название';
  }

  getVote () {
    return this.props.moviesData && this.props.moviesData.vote_average || '';
  }

  getReleaseDate () {
    let date = this.props.moviesData && this.props.moviesData.release_date;
    if (!date)
      return '';
    
    date = new Date(date);
    return date.toLocaleDateString();
  }

  getLinkUrl () {
    return this.props.moviesData && this.props.moviesData.id && `/movie/${this.props.moviesData.id}` || '';
  }

  isFavourite () {
    return this.props.moviesData && this.props.moviesData.isFavourite || false;
  }

  render () {
    let posterImgUrl  = this.getPosterUrl(),
        isFavourite = this.isFavourite();
    
    return (
      <div className='movie-item'>
        <div className='movie-item__poster-wrapper'>
          { posterImgUrl && <img src={posterImgUrl} alt="poster" className='movie-item__img'></img>
          }
        </div>
        <div className='movie-item__content'>
          <h3 className='movie-item__title'>{this.getTitle()}</h3>
          <div className='movie-item__row'>
            <div className='movie-item__left-column'>
              <p>Дата релиза: {this.getReleaseDate()}</p>
              <p>Рейтинг: {this.getVote()}</p>
              <Link className='movie-item__link' to={this.getLinkUrl()}><span className='visually-hidden'>На страницу фильма</span></Link>
            </div>
            <div className='movie-item__right-column'>
              <button className={
                  isFavourite
                    ? 'movie-item__favourite-button movie-item__favourite-button--is-favourite'
                    : 'movie-item__favourite-button'} type='button'
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
export default MovieItem;