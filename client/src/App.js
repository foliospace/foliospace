import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Navigation from './components/shared/Navigation';
import HomePage from './components/home/HomePage';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <main>
          <Route path="/" exact component={HomePage} />
        </main>
        <img src={logo} alt="Logo" />;
      </div>
    );
  }
}