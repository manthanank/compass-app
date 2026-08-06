import { HttpInterceptorFn } from '@angular/common/http';

export const telemetryInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: {
      'X-Apex-Client': 'OutdoorCompassApp-v1',
      'X-Client-Timestamp': Date.now().toString(),
    },
  });
  return next(cloned);
};
