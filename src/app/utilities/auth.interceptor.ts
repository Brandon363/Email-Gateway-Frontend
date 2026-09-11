// import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Observable } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };



import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
