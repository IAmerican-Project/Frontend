import { provideRouter }            from '@angular/router';
import { provideHttpClient }        from '@angular/common/http';    // ← importa esto
import { routes }                   from './app.routes';

export const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ]
};
