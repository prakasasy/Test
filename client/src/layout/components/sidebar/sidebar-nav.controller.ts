import { InjectionToken } from '@angular/core';
import type { SidebarNavActiveMatch, SidebarNavGroupItem } from './sidebar-nav.types';

export interface SidebarNavController {
  navigationUrl(): string;
  sidebarCollapsed(): boolean;
  useFlyoutSubmenus(): boolean;
  isNavExpanded(id: string): boolean;
  toggleNavGroup(
    group: SidebarNavGroupItem,
    event: MouseEvent,
    variant: 'accordion' | 'flyout',
  ): void;
  groupRowActive(match: SidebarNavActiveMatch): boolean;
  onMobileClose(): void;
}

export const SIDEBAR_NAV_CONTROLLER = new InjectionToken<SidebarNavController>(
  'SidebarNavController',
);
