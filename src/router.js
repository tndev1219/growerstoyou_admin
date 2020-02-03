import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

// const Register = Loadable({
//   loader: () => import('./views/Pages/Register'),
//   loading
// });

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

const AuthedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const UnAuthedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class AppRouter extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <UnAuthedRoute exact path="/login" name="Login Page" component={Login} isLoggedIn={this.props.isLoggedIn}/>
          {/* <UnAuthedRoute exact path="/register" name="Register Page" component={Register} isLoggedIn={this.props.isLoggedIn}/> */}
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <AuthedRoute path="/" name="Home" component={DefaultLayout} isLoggedIn={this.props.isLoggedIn}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default connect(state => ({
  isLoggedIn: state.Auth.idToken !== null
}))(AppRouter);
