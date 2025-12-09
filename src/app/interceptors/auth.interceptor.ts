// src/app/interceptors/auth.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getJwtToken();
    
    // 🔑 AJOUTEZ CETTE LIGNE POUR VÉRIFIER LE FLUX
    console.log(`[AuthInterceptor] Request URL: ${request.url}`);
    console.log(`[AuthInterceptor] Token found: ${!!token}`);

    // Si un jeton existe et que l'URL n'est pas celle de la connexion/inscription 
    if (token && !request.url.includes('/auth/login')) {
        // 🔑 AJOUTEZ CETTE LIGNE POUR VÉRIFIER SI L'EN-TÊTE EST VRAIMENT AJOUTÉ
        console.log('[AuthInterceptor] Attaching Bearer token.'); 
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}` 
          }
        });
    }

    return next.handle(request);
  }
}