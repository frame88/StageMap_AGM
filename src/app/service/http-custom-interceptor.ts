/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { map, catchError, filter, switchMap, take} from 'rxjs/operators';
import { AuthService } from '../core/login/auth.service';
import { IToken } from '../models/IToken';

@Injectable({ providedIn: 'root' })
//Called once, before the instance is destroyed.
//Add 'implements OnDestroy' to the class.
export class HttpCustomInterceptor implements HttpInterceptor, OnDestroy {
  subscription: Subscription = new Subscription();

  constructor(
    private service: AuthService
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const _userLogged = this.service.isLogged();

    if (_userLogged && !request.url.includes('Auth')) {
      const _tokenSessionString =
        localStorage.getItem('token') ?? '';
        console.log('ciao');
        // localStorage.getItem(SessionKey.TOKEN_DATA_SESSION) ?? '';
      const _tokenSession = JSON.parse(_tokenSessionString);
      request = this.addToken(request, _tokenSession.token);
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json'),
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => event),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // Error custom message Http interceptor 401 //
          return this.handle401Error(request, next);
        } else if (err.status === 403) {
          //this.route.navigateByUrl('access-denied');
        } else {
          if (err.status === 500 && _userLogged) {
            // Error custom message Http interceptor 500 //
          }
        }

        return throwError(() => new Error('HTTP Error'));
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    console.log(token);
    return request.clone({
      setHeaders: {
        // eslint-disable-next-line quote-props
        'Authorization': `Bearer ${token}`,
      },
    });
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    return this.service.refreshToken().pipe(
      switchMap((jwt: IToken) => {
        console.log('401 error');
        return next.handle(this.addToken(request, jwt.data.token));
      })
    );
  }
}



