import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionService } from '../../../core/services/auth-session-service';
import { AuthStateService } from '../../../core/services/auth-state-service';
import { SidebarStateService } from '../../services/sidebar-state.service';

@Component({
  selector: 'app-topbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  readonly sidebarState = inject(SidebarStateService);
  private readonly authSession = inject(AuthSessionService);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  readonly userMenuOpen = signal(false);
  readonly userName = signal('');
  readonly userInitial = signal('?');

  constructor() {
    effect(() => {
      const user = this.authSession.currentUser();
      if (user) {
        this.userName.set(user.email ?? 'User');
        const name = user.email?.trim() ?? '';
        this.userInitial.set(name.length > 0 ? name[0].toUpperCase() : '?');
      } else {
        this.userName.set('User');
        this.userInitial.set('?');
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const trigger = document.getElementById('user-menu-trigger');
    const menu = document.getElementById('user-dropdown-menu');
    if (
      this.userMenuOpen() &&
      trigger &&
      menu &&
      !trigger.contains(target) &&
      !menu.contains(target)
    ) {
      this.closeUserMenu();
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  onLogout(): void {
    this.closeUserMenu();
    this.authState.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => this.router.navigate(['/auth/login']),
    });
  }
}
