import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../services/loading-service';
import { inject } from '@angular/core';
import { SKIP_GLOBAL_LOADER } from '../tokens/loader.token';
import { finalize } from 'rxjs';

export const globalLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoadingService);

  // Option A — per-request opt-out
  const skipByContext = req.context.get(SKIP_GLOBAL_LOADER);

  const shouldSkip = skipByContext;

  if (!shouldSkip) {
    loader.start();
  }

  return next(req).pipe(
    finalize(() => {
      if (!shouldSkip) {
        loader.stop();
      }
    })
  );
};
