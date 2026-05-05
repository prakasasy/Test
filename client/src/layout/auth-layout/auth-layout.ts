import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarStateService } from '../services/sidebar-state.service';

@Component({
  selector: 'app-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
  host: {
    class: 'block h-full min-h-0',
  },
})
export class AuthLayout {
  constructor() {
    const sidebarState = inject(SidebarStateService);
    sidebarState.setCollapsed(false);
  }
}
