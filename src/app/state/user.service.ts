import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../app.config';
import { UserStore } from './user.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private userStore: UserStore, private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    this.userStore.update((state) => ({ ...state, isLoading: true }));
    return this.http.get<User[]>('/users').pipe(
      tap((users) => {
        this.userStore.update((state) => ({ ...state, users, isLoading: false }));
      })
    );
  }

  addUser(name: string, active: boolean): Observable<number> {
    this.userStore.update((state) => ({ ...state, isLoading: true }));
    return this.http.post<number>('/users', { name, active }).pipe(
      tap((id) => {
        this.userStore.update((state) => ({ ...state, isLoading: false, users: [...state.users, { active, name, id }] }));
      })
    );
  }

  checkUniqueUserName(name: string): Observable<HttpResponse<number>> {
    this.userStore.update((state) => ({ ...state, isLoading: true }));
    return this.http
      .get<number>('/check-user-name', { params: { name }, observe: 'response' })
      .pipe(tap(() => this.userStore.update((state) => ({ ...state, isLoading: false }))));
  }
}
