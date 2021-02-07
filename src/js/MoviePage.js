import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import MovieDescription from './MovieDescription';

function MoviePage (props) {
  let { id } = useParams();
  
  return (
    <main>
      <div className="container movie-page__container">
        <Link className='movie-page__link-back' to='/'>Назад</Link>

        <MovieDescription 
          apiKey={props.apiKey} 
          movieIid={id}
          favouritesActions={props.favouritesActions}/>
      </div>
    </main>
  );
}
export default MoviePage;