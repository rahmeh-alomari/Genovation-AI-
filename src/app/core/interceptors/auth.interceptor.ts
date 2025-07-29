import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const messageService = inject(MessageService);

  const token = localStorage.getItem('auth_token');
  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(authReq).pipe(
    tap({
      next: (event) => {

        if (event instanceof HttpResponse) {
          if (req.method !== 'GET') {
            const toastMessage = event.body?.message || 'Request completed successfully';
            messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: toastMessage,
              life: 3000,
            });
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        const errorMsg = err.error?.message || err.message || 'Something went wrong';

        messageService.add({
          severity: 'error',
          summary: `Error ${err.status}`,
          detail: errorMsg,
          life: 5000,
        });
      },
    })
  );
};
