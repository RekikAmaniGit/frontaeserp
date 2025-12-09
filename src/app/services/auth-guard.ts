// src/app/services/auth-guard.ts

import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * 🔑 AuthGuard : Protège les routes en vérifiant l'état de connexion de l'utilisateur.
 * * Si l'utilisateur est connecté, retourne true (accès autorisé).
 * Si l'utilisateur n'est pas connecté, redirige vers la page de connexion ('/login').
 */
export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  
  // Injection des dépendances nécessaires
  const authService = inject(AuthService);
  const router = inject(Router);

  // Utiliser l'Observable isLoggedIn() du service pour vérifier l'état
  return authService.isLoggedIn().pipe(
    take(1), // 🛑 S'assurer de ne prendre qu'une seule valeur pour compléter l'Observable
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Utilisateur connecté, accès autorisé
        return true; 
      } else {
        // Utilisateur non connecté, rediriger vers la page de connexion
        console.warn('Accès non autorisé. Redirection vers la page de login.');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

// REMARQUE: Pensez à corriger également l'import de 'AuthService' dans ce fichier 
// s'il est situé dans un dossier différent.