import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { JwtAuthConfig, JWT_AUTH_CONFIG } from './jwt-auth.config';
import { JwtAuthStorage } from './jwt-auth.storage';
import { JwtAuthToken } from './jwt-auth.type';

@Injectable({ providedIn: 'root' })
export class JwtAuthService {
  private token$ = new BehaviorSubject(JwtAuthStorage.get());
  private setToken(value: JwtAuthToken) {
    this.token$.next(value);
  }
  getToken() {
    return this.token$.getValue();
  }

  userLoggedIn$ = new Subject<void>();
  userLoggedOut$ = new Subject<void>();

  private http: HttpClient;

  constructor(@Inject(JWT_AUTH_CONFIG) private config: JwtAuthConfig, handler: HttpBackend) {
    this.http = new HttpClient(handler);
    this.token$.subscribe(token => (token ? this.loginHandler(token) : this.logoutHandler()));
  }

  login(username: string, password: string) {
    const data = `grant_type=password&client_id=dashboard&username=${username}&password=${password}`;
    return this.http.post<JwtAuthToken>(this.config.apiTokenUrl, data).pipe(tap(data => this.setToken(data)));
  }

  refreshToken() {
    const data = `grant_type=refresh_token&client_id=dashboard&refresh_token=${this.getToken()?.refresh_token}`;
    return this.http.post<JwtAuthToken>(this.config.apiTokenUrl, data).pipe(tap(data => this.setToken(data)));
  }

  logout() {
    this.setToken(null);
  }

  private loginHandler(token: JwtAuthToken) {
    JwtAuthStorage.set(token);
    this.userLoggedIn$.next();
  }

  private logoutHandler() {
    JwtAuthStorage.remove();
    this.userLoggedOut$.next();
  }
}
