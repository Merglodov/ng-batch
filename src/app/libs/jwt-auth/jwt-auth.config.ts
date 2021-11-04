import { InjectionToken } from '@angular/core';

export interface JwtAuthConfig {
  apiTokenUrl: string;
}

export const JWT_AUTH_CONFIG = new InjectionToken<JwtAuthConfig>('JWT_AUTH_CONFIG');
