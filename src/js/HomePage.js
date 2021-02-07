import React from 'react';
import MovieList from './MovieList';

function HomePage (props) {
  return (
    <>
      <header>
        <div className="container">
          <h1>The Movie Database</h1>
        </div> 
      </header>
      <main>
        <div className="container">
        <MovieList 
            apiKey={props.apiKey}
            favourites={props.favourites}
            favouritesActions={props.favouritesActions}/>
        </div>
      </main>
    </>
  );
}
export default HomePage;