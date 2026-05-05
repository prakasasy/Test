import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarIcon } from './sidebar-icon';
import { SIDEBAR_NAV_CONTROLLER } from './sidebar-nav.controller';
import type { SidebarNavGroupItem, SidebarNavItem } from './sidebar-nav.types';
import { isNavGroup, isNavLink } from './sidebar-nav.types';
import { maxAccordionHeightRem } from './sidebar-nav.utils';

@Component({
  selector: 'app-sidebar-nav-tree',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, SidebarIcon, SidebarNavTree],
  templateUrl: './sidebar-nav-tree.html',
})
export class SidebarNavTree {
  protected readonly ctrl = inject(SIDEBAR_NAV_CONTROLLER);

  readonly items = input.required<readonly SidebarNavItem[]>();
  readonly variant = input.required<'accordion' | 'flyout'>();
  readonly depth = input(0);

  protected maxHeightRem(items: readonly SidebarNavItem[]): number {
    return maxAccordionHeightRem(items);
  }

  protected onGroupClick(group: SidebarNavGroupItem, event: MouseEvent): void {
    this.ctrl.toggleNavGroup(group, event, this.variant());
  }

  protected readonly isNavGroup = isNavGroup;
  protected readonly isNavLink = isNavLink;
}
