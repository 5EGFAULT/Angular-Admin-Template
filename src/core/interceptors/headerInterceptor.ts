import { Guid } from 'guid-typescript';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeaderConstant } from '../constants/header.static';
import { StorageService } from '../services/common/storage.service';

@Injectable()
export class headerInterceptor implements HttpInterceptor {
  constructor(
    private readonly headerConstant: HeaderConstant,
    private readonly storage: StorageService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!!this.storage.getValueFromLocalStorage('token')) {
      const token = 'bearer '.concat(
        this.storage.getValueFromLocalStorage('token').token
      );
      const LoginUser = this.storage.getValueFromLocalStorage('user');
      if (!!LoginUser) {
        const LoginUserName =
          LoginUser['firstName'] + ' ' + LoginUser['lastName'];
        httpRequest = httpRequest.clone({
          headers: httpRequest.headers
            .set(this.headerConstant.authorization, token)
            .set(this.headerConstant.request, Guid.create().toString())
            .set(this.headerConstant.actionBy, LoginUserName)
            .set(this.headerConstant.userId, LoginUser['AdminId'])
            .set(this.headerConstant.actionBy, LoginUser['email']),
        });
      } else {
        httpRequest = httpRequest.clone({
          headers: httpRequest.headers
            .set(this.headerConstant.authorization, token)
            .set(this.headerConstant.request, Guid.create().toString()),
        });
      }
    } else {
      httpRequest = httpRequest.clone({
        headers: httpRequest.headers.set(
          this.headerConstant.request,
          Guid.create().toString()
        ),
      });
    }

    return next.handle(httpRequest);
  }
}
