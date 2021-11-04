import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtAuthInterceptor } from './jwt-auth.interceptor';
import { JwtAuthConfig, JWT_AUTH_CONFIG } from './jwt-auth.config';

@NgModule()
export class JwtAuthModule {
  static forRoot(config: JwtAuthConfig): ModuleWithProviders<JwtAuthModule> {
    return {
      ngModule: JwtAuthModule,
      providers: [
        { provide: JWT_AUTH_CONFIG, useValue: config },
        { provide: HTTP_INTERCEPTORS, useClass: JwtAuthInterceptor, multi: true },
      ],
    };
  }
}
