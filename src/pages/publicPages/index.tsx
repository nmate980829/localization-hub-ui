import * as React from "react"
import {
  Route,
} from "react-router-dom";
import { FrontPage } from './Front';
import { LoginPage } from './Login';
import { RegisterPage } from './Register';

export const PublicRoutes = [
  <Route path="/login" component={LoginPage} />,
  <Route path="/register/:token" component={RegisterPage} />,
  <Route path="/" exact component={FrontPage} />
]