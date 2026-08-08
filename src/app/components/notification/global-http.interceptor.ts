import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LoadingService } from '../../shared/services/loading.service'; // <-- change path if required

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('➡️ Request:', req.url);

    this.loadingService.show();

    return next.handle(req).pipe(
      finalize(() => {
        console.log('✅ Completed:', req.url);
        this.loadingService.hide();
      })
    );
  }
}
