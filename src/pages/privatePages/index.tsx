import * as React from "react"
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import { InvitesPage } from './Invites';
import { UserPage } from './User';
import { UsersPage } from './Users';

export const PrivateRouter = [
  <Route path="/invites/" exact component={InvitesPage} />,
  <Route path="/users/" exact component={UsersPage} />,
  <Route path={`/users/:id`} component={UserPage} />
];
/* 
export const InvitesRouter = () => {
  let { path, url } = useRouteMatch();
  console.log('invite')
  return (
    <Switch>
      <Route path={path} exact component={InvitesPage} />
      <Route path={`${path}/:id`} />
    </Switch>
  );
} */