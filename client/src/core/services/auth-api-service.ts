import { inject, Injectable } from '@angular/core';
import { CurrentUser } from '../../types/user';
import { HttpClient } from '@angular/common/http';
import { withNoLoader } from '../tokens/loader.token';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + 'auth';

  login(payload: { email: string; password: string }) {
    return this.http.post<{ accessToken: string; accessTokenExpiry: string }>(
      `${this.baseUrl}/login`,
      payload,
      { 
        withCredentials: true,
        context: withNoLoader()
      }
    );
  }

  refresh() {
    return this.http.post<{ accessToken: string; accessTokenExpiry: string }>(
      `${this.baseUrl}/refresh-token`,
      {},
      {   
        withCredentials: true,
        context: withNoLoader()
      }
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, { 
      withCredentials: true,
      context: withNoLoader()
    });
  }

  me() {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`, { 
      context: withNoLoader()
    });
  }
}
