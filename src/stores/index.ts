import {useContext} from 'react';
import {configure} from 'mobx';
import {SyncTrunk} from 'mobx-sync';
import {MobXProviderContext} from 'mobx-react';
import AppStore from './AppStore';

configure({
  enforceActions: 'always',
});
const appStore = new AppStore();

const stores = {
  appStore
};

const trunk = new SyncTrunk(stores, {storage: localStorage});

// AsyncTrunk exists, but it makes it hard to use the stores hook
// eslint-disable-next-line no-void
void trunk.init();
console.log('store rehydrated');

export function createStores() {
  return stores;
}

export type Stores = typeof stores;
export function useStores(): Stores {
  // @ts-ignore
  return useContext(MobXProviderContext);
}
