import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap, finalize, tap } from 'rxjs/operators';

import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthToken } from './jwt-auth.type';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {
  private isTokenRefreshing = false;
  private token$ = new Subject<JwtAuthToken>();
  private tokenRetrieved$ = this.token$.pipe(filter(data => !!data));

  constructor(private authService: JwtAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(JwtAuthInterceptor.setHeaders(req, this.authService.getToken()))
      .pipe(catchError(error => (error.status === 401 ? this.handle401Error(req, next) : throwError(error))));
  }

  private static setHeaders(request: HttpRequest<any>, token: JwtAuthToken) {
    return request.clone({ setHeaders: { Authorization: `${token?.token_type} ${token?.access_token}` } });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    const request = !this.isTokenRefreshing ? this.refreshToken() : this.tokenRetrieved$.pipe(take(1));
    return request.pipe(switchMap(data => next.handle(JwtAuthInterceptor.setHeaders(req, data))));
  }

  private refreshToken() {
    this.isTokenRefreshing = true;
    this.token$.next(null);
    return this.authService.refreshToken().pipe(
      tap(data => this.token$.next(data)),
      catchError(error => {
        this.authService.logout();
        return throwError(error);
      }),
      finalize(() => this.token$.next(null))
    );
  }
}
