import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from '../components/topbar/topbar';
import { Sidebar } from '../components/sidebar/sidebar';
import { Footer } from '../components/footer/footer';
import { SidebarStateService } from '../services/sidebar-state.service';
import { GlobalLoader } from "../../shared";

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Topbar, Sidebar, Footer, GlobalLoader],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  host: {
    class: 'block h-full min-h-0',
  },
})
export class MainLayout {
  protected readonly sidebarState = inject(SidebarStateService);
}
