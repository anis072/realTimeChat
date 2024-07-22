import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token && !req.url.includes('login') ) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(cloned);
  } else {
    return next(req);
  }
};