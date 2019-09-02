import React from 'react';
import { BrowserRouter, Route, Redirect, Switch }  from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingPage from './pages/Bookings';
import EventPage from './pages/Events';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/events" component={EventPage} />
          <Route path="/bookings" component={BookingPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;