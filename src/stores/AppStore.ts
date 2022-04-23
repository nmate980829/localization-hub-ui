import {observable, action, makeObservable, computed} from 'mobx';
import { ignore } from 'mobx-sync';
import { SERVERROLE, TokenDto, UserResponse as User } from '../client';

export class AppStore {
  @observable
  token?: TokenDto;
  @observable
  user?: User;
  @observable
  drawerOpen: boolean = false;
  @observable @ignore
  loading: boolean = false;
  @observable @ignore
  refreshing: boolean = false;
  @computed
  public get isLoggedIn(): boolean {
    return this.token !== undefined;
  }
  @computed
  public get role(): SERVERROLE | undefined {
    return this.user?.role;
  }
  @action.bound
  login(token: TokenDto) {
    this.token = token;
  }
  @action.bound
  logout() {
    this.token = undefined;
    this.user = undefined;
  }
  @action.bound
  syncMe(user: User) {
    this.user = user;
  }
  @action.bound
  openDrawer() {
    this.drawerOpen = true;
  }
  @action.bound
  closeDrawer() {
    this.drawerOpen = false;
  }
  @action.bound
  load() {
    this.loading = true;
  }
  @action.bound
  loaded() {
    this.loading = false;
  }
  @action.bound
  refresh() {
    this.refreshing = true;
  }
  @action.bound
  refreshed() {
    this.refreshing = false;
  }
  @action.bound
  reset() {
    this.token = undefined;
    this.user = undefined;
    this.drawerOpen = false;
    this.loading = false;
  }
  constructor() {
    makeObservable(this)
  }
}
export default AppStore;
