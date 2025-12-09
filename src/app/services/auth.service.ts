// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, AuthResponse } from '../common/auth-models'; // 🔑 Créez ce fichier
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // L'URL de base doit pointer vers votre contrôleur d'authentification
  private authUrl = environment.apiUrl + '/auth'; 

  // BehaviorSubject pour surveiller l'état de connexion de manière réactive
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) { }

  /**
   * Envoie les identifiants à l'API et stocke le JWT en cas de succès.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.storeToken(response.token);
          this.storeUserData(response);
          this.loggedInSubject.next(true);
        })
      );
  }

  /**
   * Déconnexion: supprime le jeton et les données utilisateur.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    this.loggedInSubject.next(false);
  }

  /**
   * Retourne l'Observable de l'état de connexion.
   */
  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  /**
   * Récupère le JWT stocké. Utilisé par l'intercepteur.
   */
  getJwtToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Stockage physique du token dans le localStorage.
   */
  private storeToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Stockage des autres données utilisateur (matricule, rôles...).
   */
  private storeUserData(user: AuthResponse): void {
    const data = {
        matricule: user.matricule, 
        username: user.username, 
        roles: user.roles
    };
    localStorage.setItem('user_data', JSON.stringify(data));
  }
  
  /**
   * Vérifie si un jeton existe déjà.
   */
  private hasToken(): boolean {
      return !!localStorage.getItem('jwt_token');
  }
}