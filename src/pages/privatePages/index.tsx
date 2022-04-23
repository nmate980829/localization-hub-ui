import * as React from "react"
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import { InvitesPage } from './Invites';
import { RolePage } from './Role';
import { RolesPage } from './Roles';
import { SettingsPage } from './Settings';
import { UserPage } from './User';
import { UsersPage } from './Users';

export const PrivateRouter = [
  <Route path="/invites/" exact component={InvitesPage} key="inv"/>,
  <Route path="/settings/" exact component={SettingsPage} key="settings"/>,
  <Route path="/roles/:id" exact component={RolePage} key="roleid"/>,
  <Route path="/roles/" exact component={RolesPage} key="roles"/>,
  <Route path="/users/" exact component={UsersPage} key="users"/>,
  <Route path={`/users/:id`} exact component={UserPage} key="usersid"/>
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