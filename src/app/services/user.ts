import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetResponseUsers } from '../common/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private filterUrl = 'http://localhost:8071/api/users/search/filter'; // ✅ Nouveau endpoint

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
): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

  for (const key in filters) {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params = params.append(key, filters[key]);
    }
  }

  if (sortField) {
    const direction = sortOrder === 1 ? 'asc' : 'desc';
    params = params.append('sort', `${sortField},${direction}`);
  }

  return this.httpClient.get('http://localhost:8071/api/users/search/filter', { params });
}
}