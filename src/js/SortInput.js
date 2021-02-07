import React from 'react';

function SortInput (props) {
  return (
    <fieldset className='sort'>
      <label htmlFor='sort-input'>Сортировать:</label>
      <select className='sort__select-input' id='sort-input' name='sort-by' value={props.sortBy} onChange={props.sortHandler}>
        <option value='popularity.desc'>по популярности по убыванию</option>
        <option value='popularity.asc'>по популярности по возрастанию</option>
        <option value='vote_average.desc'>по рейтингу по убыванию</option>
        <option value='vote_average.asc'>по рейтингу по возрастанию</option>
        <option value='release_date.desc'>по дате по убыванию</option>
        <option value='release_date.asc'>по дате по возрастанию</option>
      </select>
    </fieldset>
  );
}
export default SortInput;