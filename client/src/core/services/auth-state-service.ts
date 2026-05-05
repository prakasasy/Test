import { inject, Injectable } from '@angular/core';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import { AuthApiService } from './auth-api-service';
import { TokenStorageService } from './token-storage-service';
import { AuthSessionService } from './auth-session-service';
import { Router } from '@angular/router';
import { isAllowed } from '../auth/authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authApi = inject(AuthApiService);
  private tokenStorage = inject(TokenStorageService);
  private authSession = inject(AuthSessionService);
  private router = inject(Router);

  login(payload: { email: string; password: string }) {
    return this.authApi.login(payload).pipe(
      tap(res => this.tokenStorage.setAccessToken(res.accessToken)),
      switchMap(() => this.authApi.me()),
      tap(user => this.authSession.setAuthenticated(user))
    );
  }

  refreshAccessToken() {
    return this.authApi.refresh().pipe(
      tap((res) => {
        this.tokenStorage.setAccessToken(res.accessToken);
      }),
      map(res => res.accessToken)
    );
  }

  restoreSession() {
    return this.authApi.refresh().pipe(
      tap(res => this.tokenStorage.setAccessToken(res.accessToken)),
      switchMap(() => this.authApi.me()),
      tap(user => this.authSession.setAuthenticated(user))
    );
  }

  handleRefreshFailed(): void {
    this.clearClientSession();
    this.router.navigate(['/login']);
  }

  logout() {
    return this.authApi.logout().pipe(
      finalize(() => this.clearClientSession())
    );
  }

  clearClientSession(): void {
    this.tokenStorage.clear();
    this.authSession.setUnauthenticated();
  }

  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }


  hasRole(role: string): boolean {
    const user = this.authSession.currentUser();
    return !!user && isAllowed(user, { anyRoles: [role] });
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.authSession.currentUser();
    return !!user && isAllowed(user, { anyRoles: roles });
  }

  hasPermission(permission: string): boolean {
    const user = this.authSession.currentUser();
    return !!user && isAllowed(user, { anyPermissions: [permission] });
  }

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.authSession.currentUser();
    return !!user && isAllowed(user, { anyPermissions: permissions });
  }
  
}
