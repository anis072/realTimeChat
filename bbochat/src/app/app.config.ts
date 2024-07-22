import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore, StoreModule } from '@ngrx/store';
import { AUTH_FEATURE_KEY, authReducer } from './features/auth/data-access/+state/auth.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { CHAT_FEATURE_KEY, conversationReducer } from './features/chat/data-access/+state/chat.reducer';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    importProvidersFrom(
      StoreModule.forRoot({}),
      StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
      StoreModule.forFeature(CHAT_FEATURE_KEY, conversationReducer),

    ),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(HttpClientModule),

  ],
};
