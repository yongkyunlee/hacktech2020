import React, { Component } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import WebMap from './containers/WebMap/WebMap';

const history = createBrowserHistory();

class App extends Component {
  render() {
    const routes = (
      <Switch>
        <Route path="/" component={WebMap}/>
        <Redirect to="/"/>
      </Switch>
    );

    return (
      <Router history={history}>
        <div>
          {routes}
        </div>
      </Router>
    );
  }
}

export default App;
