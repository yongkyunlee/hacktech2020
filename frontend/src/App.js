import React, { Component } from 'react';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import WebMap from './containers/WebMap/WebMap';

const history = createHistory();

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
