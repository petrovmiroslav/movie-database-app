import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import HomePage from './HomePage';
import MoviePage from './MoviePage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: '24894b1adc57e9ccd10415c305a11ad5',
      favourites: this.getFavourites(),
      favouritesActions: {
        add: this.addFavourites.bind(this),
        remove: this.removeFavourite.bind(this),
        addToData: this.addFavouriteToData.bind(this),
      }
    }
  }

  getFavourites () {
    return JSON.parse(localStorage.getItem('favourites')) || [];
  }

  addFavourites (id) {
    let favourites = this.state.favourites;
    favourites.push(+id);
    localStorage.setItem('favourites', JSON.stringify(favourites));
    this.setState({
      favourites: favourites,
    });
  }

  removeFavourite (id) {
    let favourites = this.state.favourites,
        index = favourites.indexOf(+id);

    index >= 0 && favourites.splice(index,1);

    localStorage.setItem('favourites', JSON.stringify(favourites));
    this.setState({
      favourites: favourites,
    });
  }

  addFavouriteToData (data) {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (this.isFavourite(item.id)) {
          item.isFavourite = true
        } else {
          if (item.isFavourite) {
            delete item.isFavourite;
          }
        }
        return item;
      });
    }

    if (this.isFavourite(data.id)) {
      data.isFavourite = true;
    } else {
      if (data.isFavourite) {
        delete data.isFavourite;
      }
    }
    return data;
  }

  isFavourite (movieId) {
    return this.state.favourites.indexOf(+movieId) >= 0;
  }


  render () {
    return (
      <Router>
        <Switch>
          <Route path="/movie/:id">
            <MoviePage 
              apiKey={this.state.apiKey} 
              favourites={this.state.favourites}
              favouritesActions={this.state.favouritesActions}/>
          </Route>
          <Route exact path="/">
            <HomePage 
              apiKey={this.state.apiKey}
              favourites={this.state.favourites}
              favouritesActions={this.state.favouritesActions}/>
          </Route>
          <Redirect to='/'/>
        </Switch>
      </Router>
    );
  }
}
export default App;