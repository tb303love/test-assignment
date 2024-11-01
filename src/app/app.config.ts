/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { delay, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  active: boolean;
}

interface InMemoryDb {
  users: User[];
}

export const inMemoryDb: InMemoryDb = {
  users: [
    { id: 1, name: 'Marko', active: true },
    { id: 2, name: 'Djordje', active: true },
    { id: 3, name: 'Ana', active: true },
  ],
};

const fakeBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const { url, method, params, body } = req;

  if (url.endsWith('/users')) {
    if (method === 'GET') {
      return of(new HttpResponse<User[]>({ status: 200, body: [...inMemoryDb.users] })).pipe(delay(1000));
    } else if (method === 'POST') {
      // Update users in memory db
      if (body && typeof body === 'object' && 'active' in body && 'name' in body) {
        const nextId = inMemoryDb.users.length + 1;
        inMemoryDb.users = inMemoryDb.users.concat([{ name: String(body.name), active: Boolean(body.active), id: nextId }]);
        return of(new HttpResponse({ status: 200, body: nextId })).pipe(delay(1000));
      }
      return of(new HttpResponse({ status: 422 })).pipe(delay(1000));
    }
  }

  if (url.endsWith('check-user-name') && method === 'GET') {
    const possibleUserFound = inMemoryDb.users.find(({ name }) => name === params.get('name'));
    if (possibleUserFound) {
      return of(new HttpResponse({ status: 409 })).pipe(delay(2000));
    }
    return of(new HttpResponse({ status: 200 })).pipe(delay(2000));
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([fakeBackendInterceptor])),
  ],
};
