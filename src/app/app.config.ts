// app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes'; // Assurez-vous d'avoir vos routes définies
import { AuthInterceptor } from './interceptors/auth.interceptor'; // 🔑 ASSUREZ-VOUS QUE CE FICHIER EXISTE
import { provideAnimations } from '@angular/platform-browser/animations'; // Pour PrimeNG
import { provideToastr } from 'ngx-toastr'; // Exemple de service de Toast

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(), // 🔑 Pour les animations de PrimeNG
    // 🔑 AJOUT MANQUANT : Enregistrement du service Toastr
    provideToastr({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
    }), 
    
    // --- Configuration HTTP ---
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // --- Fin Configuration HTTP ---
  ]
};