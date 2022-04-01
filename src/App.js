import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';
import React, { useEffect, useState } from "react";
import IdleTimer from "./IdleTimer";
import DashBoard from './pages/DashBoard';
function App() {
  const authCtx = useContext(AuthContext);
  const [isTimeout, setIsTimeout] = useState(false);
  useEffect(() => {
    const timer = new IdleTimer({
      timeout: 20, //expire after 10 seconds
      onTimeout: () => {
        setIsTimeout(true);
      },
      onExpired: () => {
        // do something if expired on load
        setIsTimeout(true);
      }
    });

    return () => {
      timer.cleanUp();
    };
  }, []);
  if(isTimeout){
    authCtx.logout()
  }
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          {!authCtx.isLoggedIn && <HomePage />}
          {authCtx.isLoggedIn && <DashBoard />}
        </Route>
       
        {!authCtx.isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
        )}
        <Route path='/profile'>
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
