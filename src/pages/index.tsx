import * as React from "react"
import { useObserver } from 'mobx-react';
import {
  Route,
  Switch} from "react-router-dom";
import { MainLayout } from '../components/layouts/MainLayout';
import { LoaderOverlay } from '../components/LoaderOverlay';
import { useStores } from '../stores';
import { PublicRoutes } from './publicPages';
import {  PrivateRouter } from './privatePages';
import { ProjectRouter } from './projectPages';

export const MainRouter = () => {
  const {appStore} = useStores();
  return useObserver(()=>(
    <MainLayout>
      <Switch>
        {PrivateRouter}
        {ProjectRouter}
        {PublicRoutes}
      </Switch>
    </ MainLayout>
  ));
};