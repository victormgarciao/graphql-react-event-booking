import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch }  from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingPage from './pages/Bookings';
import EventPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact />
              <Route path="/auth" component={AuthPage} />
              <Route path="/events" component={EventPage} />
              <Route path="/bookings" component={BookingPage} />
            </Switch>
          </main>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
