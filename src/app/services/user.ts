import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
// J'ai retiré 'GetResponseUsers' car il provoquait une erreur d'importation (TS2305).
// Veuillez vous assurer que 'PaginatedUsers', 'UserListProjection', et 'User' sont correctement exportés.
import { PaginatedUsers, UserListProjection, User } from '../common/user'; 

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8071/api/users';
  private filterUrl = `${this.apiUrl}/search/filter`;

  constructor(private httpClient: HttpClient) {}

  /**
   * Récupère la liste paginée, triée et filtrée des utilisateurs.
   */
  getUserListPaginate(
    page: number,
    size: number,
    filters: Record<string, any> = {},
    sortField?: string,
    sortOrder?: number
  ): Observable<PaginatedUsers> {
    
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    for (const key in filters) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.append(key, filters[key]);
      }
    }

    if (sortField) {
      /* PrimeNG utilise 1 pour asc, -1 pour desc. L'API Spring utilise 'asc' ou 'desc'. */
      const direction = sortOrder === 1 ? 'asc' : 'desc';
      params = params.append('sort', `${sortField},${direction}`);
    }
    console.log("log");
    
    return this.httpClient.get<PaginatedUsers>(this.filterUrl, { params }).pipe(
      tap(response => {
        console.log("Réponse API brute reçue (via tap) :", response);
      })
    );
  }

  /** CRUD Methods */

  createUser(user: User): Observable<User> {
    /* Supprime le matricule (ID) pour la création, car il sera généré par le backend. */
    const userToCreate = { ...user, matricule: undefined }; 
    return this.httpClient.post<User>(this.apiUrl, userToCreate);
  }

  /**
   * Vérifie si un utilisateur existe déjà par username et/ou email.
   * Appelle le backend sur GET /api/users/exists.
   */
  checkUserExists(username?: string, email?: string): Observable<{ usernameExists: boolean; emailExists: boolean }> {
    let params = new HttpParams();

    if (username) {
      params = params.set('username', username);
    }

    if (email) {
      params = params.set('email', email);
    }

    return this.httpClient.get<{ usernameExists: boolean; emailExists: boolean }>(`${this.apiUrl}/exists`, { params });
  }

  updateUser(matricule: number, user: User): Observable<User> {
    /* Crée une copie de l'utilisateur pour la modification */
    const userToUpdate = { ...user };
    
    /* Si le mot de passe est vide ou null, on le supprime de l'objet pour éviter de le mettre à jour */
    if (userToUpdate.password === null || userToUpdate.password === '') {
        delete userToUpdate.password; 
    }

    /* Envoie la requête PUT à l'URL spécifique de la ressource. */
    return this.httpClient.put<User>(`${this.apiUrl}/${matricule}`, userToUpdate); 
  }

  deleteUser(matricule: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${matricule}`);
  }

  /**
   * Récupère la liste des positions uniques (valeurs brutes)
   * Endpoint: GET /api/users/lookup/positions
   */
  getPositionsLookup(): Observable<string[]> {
    const lookupUrl = `${this.apiUrl}/lookup/positions`;
    return this.httpClient.get<string[]>(lookupUrl);
  }

  /**
   * Récupère la liste des grades uniques (valeurs brutes)
   * Endpoint: GET /api/users/lookup/grades
   */
  getGradesLookup(): Observable<string[]> {
    const lookupUrl = `${this.apiUrl}/lookup/grades`;
    return this.httpClient.get<string[]>(lookupUrl);
  }
}