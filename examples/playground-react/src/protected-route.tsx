import { sessionQuery } from './session/state';
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

// https://tylermcginnis.com/react-router-protected-routes-authentication/
export const ProtectedRoute = ( { component: Component, ...rest } ) => (
  <Route {...rest} render={( props ) => (
    sessionQuery.isLoggedIn() === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login'
      }}/>
  )}/>
);