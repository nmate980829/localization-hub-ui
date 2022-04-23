import * as React from "react"
import {
  Route,
} from "react-router-dom";
import { FrontPage } from './Front';
import { LoginPage } from './Login';
import { LoginCliPage } from './LoginCli';
import { RegisterPage } from './Register';

export const PublicRoutes = [
  <Route path="/login/cli" exact component={LoginCliPage} key="login-cli" />,
  <Route path="/login" exact component={LoginPage} key="login" />,
  <Route path="/register/:token" component={RegisterPage} key="register" />,
  <Route path="/" exact component={FrontPage} key="/"/>
]