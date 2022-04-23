import * as React from "react"
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import { AccessPage } from './Access';
import { BranchesPage } from './Branches';
import { IdentifierPage } from './Identifier';
import { LanguagesPage } from './Languages';
import { ProjectPage } from './Project';
import { ProjectsPage } from './Projects';

export const ProjectRouter = [
  
  <Route path={`/projects/:projectId/access`} exact component={AccessPage} key="access"/>,
  <Route path={`/projects/:projectId/languages/`} exact component={LanguagesPage} key="lang"/>,
  <Route path={`/projects/:projectId/languages/:tid`} exact component={ProjectsPage} key="langid"/>,
  <Route path={`/projects/:projectId/branches/`} exact component={BranchesPage} key="branches"/>,
  <Route path={`/projects/:projectId/branches/:tid`} exact component={ProjectsPage} key="branchesid"/>,
  <Route path={`/projects/:projectId/identifiers`} exact component={IdentifierPage} key="id"/>,
  <Route path={`/projects/:projectId/identifiers/:iid`} exact component={IdentifierPage} key="idid"/>,
  <Route path={`/projects/:projectId/translations`} exact component={ProjectsPage} key="tr"/>,
  <Route path={`/projects/:projectId`} exact component={ProjectPage} key="pid"/>,
  <Route path="/projects/" exact component={ProjectsPage} key="p"/>,

];