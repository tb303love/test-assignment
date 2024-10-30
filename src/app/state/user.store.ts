import { Injectable } from '@angular/core';
import { inMemoryDb, User } from '../app.config';
import { Store, StoreConfig } from '@datorama/akita';

export interface UserState {
  users: User[];
  isLoading: boolean;
}

export function createInitialState(): UserState {
  return {
    users: [...inMemoryDb.users],
    isLoading: false,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserStore extends Store<UserState> {
  constructor() {
    super(createInitialState());
  }
}
