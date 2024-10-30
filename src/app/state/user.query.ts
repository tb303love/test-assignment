import { Injectable } from '@angular/core';
import { UserState, UserStore } from './user.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class UserQuery extends Query<UserState> {
  selectUsers$ = this.select('users');
  selectIsUsersLoading$ = this.select('isLoading');

  constructor(store: UserStore) {
    super(store);
  }
}
