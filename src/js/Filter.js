import React from 'react';

function Filter (props) {
  let genres = props.genres && Array.isArray(props.genres) 
  && props.genres.map(genre => {
    let name = genre.name && genre.name[0].toUpperCase() + genre.name.slice(1),
        isChecked = props.selectedGenres[genre.id] || false;

    return (
      <label className='filter__label' key={genre.id}>
        <span className='filter__label-text'>
          {name}
        </span>
        <input className='filter__checkbox'
          name={name}
          key={genre.id}
          data-id={genre.id}
          type="checkbox"
          checked={isChecked}
          onChange={props.changeHadler} />
      </label>
    );
  });

  return (
    <fieldset className='filter'>
      <div className='filter__legend-wrapper'>
        <legend className='filter__legend'>Выберите жанры</legend>
      </div>
      <div className='filter__genres-container'>
        {genres}
      </div>
      <button className='filter__button' onClick={props.onApplyFilterHandler} type='button'>Применить фильтр</button>
    </fieldset>
  );
}
export default Filter;