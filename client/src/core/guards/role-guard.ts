import { CanActivateFn, Router } from "@angular/router";
import { AuthStateService } from "../services/auth-state-service";
import { inject } from "@angular/core";
import { AuthSessionService } from "../services/auth-session-service";

export const roleGuard = (roles: string[]): CanActivateFn => (route, state) => {
    const authStateService = inject(AuthStateService);
    const authSession = inject(AuthSessionService);
    const router = inject(Router);

    if (authSession.status() !== 'authenticated') {
        return router.createUrlTree(['/forbidden']);
    }

    return authStateService.hasAnyRole(roles) ? true : router.createUrlTree(['/forbidden']);
}