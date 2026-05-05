import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidebarStateService } from '../../services/sidebar-state.service';
import { AuthSessionService } from '../../../core/services/auth-session-service';
import { SIDEBAR_NAV_ITEMS } from './sidebar-nav.config';
import type { SidebarNavController } from './sidebar-nav.controller';
import { SIDEBAR_NAV_CONTROLLER } from './sidebar-nav.controller';
import type {
  SidebarNavActiveMatch,
  SidebarNavGroupItem,
  SidebarNavItem,
} from './sidebar-nav.types';
import {
  filterSidebarNavItems,
  matchNavUrl,
  idsToCloseWithGroup,
  SidebarNavVisibilityContext,
} from './sidebar-nav.utils';
import { SidebarIcon } from './sidebar-icon';
import { SidebarNavTree } from './sidebar-nav-tree';

/** Matches Tailwind `md` breakpoint (768px). */
const DESKTOP_MEDIA = '(min-width: 768px)';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SidebarNavTree],
  providers: [
    { provide: SIDEBAR_NAV_CONTROLLER, useExisting: forwardRef(() => Sidebar) },
  ],
  host: {
    class: 'fixed left-0 top-0 z-40 flex h-full w-72 max-w-[85vw] shrink-0 flex-col bg-accent transition-transform duration-300 ease-in-out md:relative md:z-40 md:h-screen md:w-auto md:translate-x-0',
    '[class.-translate-x-full]': 'isCollapsed',
  },
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements SidebarNavController {
  readonly sidebarState = inject(SidebarStateService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authSession = inject(AuthSessionService);

  private readonly visibilityCtx = computed(() => ({
    roles: this.authSession.currentUser()?.roles ?? [],
    permissions: this.authSession.currentUser()?.permissions ?? [],
  } as SidebarNavVisibilityContext));

  readonly navItems = computed<readonly SidebarNavItem[]>(() =>
    filterSidebarNavItems(SIDEBAR_NAV_ITEMS, this.visibilityCtx()),
  );

  private readonly topLevelGroupIds = computed(() => {
    const ids = new Set<string>();
    for (const item of this.navItems()) {
      if (item.kind === 'group') {
        ids.add(item.id);
      }
    }
    return ids;
  });

  /** Open accordion sections / flyout panels by group or section `id`. */
  readonly expandedIds = signal<ReadonlySet<string>>(new Set<string>());

  readonly navZone = viewChild<ElementRef<HTMLElement>>('navZone');

  readonly isDesktopViewport = signal(
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_MEDIA).matches,
  );

  readonly useFlyoutSubmenus = computed(
    () => this.sidebarState.collapsed() && this.isDesktopViewport(),
  );

  readonly navTreeVariant = computed<'accordion' | 'flyout'>(() =>
    this.useFlyoutSubmenus() ? 'flyout' : 'accordion',
  );

  private readonly navUrl = signal(this.router.url);

  get isCollapsed(): boolean {
    return this.sidebarState.collapsed();
  }

  constructor() {
    effect(() => {
      if (this.useFlyoutSubmenus()) {
        this.expandedIds.set(new Set());
      }
    });

    effect(() => {
      const url = this.navUrl();
      if (this.useFlyoutSubmenus()) {
        return;
      }
      const next = new Set<string>();
      const walk = (items: readonly SidebarNavItem[]): void => {
        for (const item of items) {
          if (item.kind === 'group') {
            if (matchNavUrl(url, item.activeMatch)) {
              next.add(item.id);
            }
            walk(item.children);
          }
        }
      };
      walk(this.navItems());
      this.expandedIds.set(next);
    });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.navUrl.set(this.router.url);
        if (this.useFlyoutSubmenus()) {
          this.expandedIds.set(new Set());
        }
      });

    afterNextRender(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        this.sidebarState.setCollapsed(true);
      }
      if (typeof window === 'undefined' || !('matchMedia' in window)) {
        return;
      }
      const mq = window.matchMedia(DESKTOP_MEDIA);
      const sync = (): void => {
        this.isDesktopViewport.set(mq.matches);
      };
      sync();
      mq.addEventListener('change', sync);

      const onDocumentClick = (event: MouseEvent): void => {
        if (!this.useFlyoutSubmenus()) {
          return;
        }
        const target = event.target;
        if (!(target instanceof Node)) {
          return;
        }
        const zone = this.navZone()?.nativeElement;
        if (zone?.contains(target)) {
          return;
        }
        this.expandedIds.set(new Set());
      };
      this.document.addEventListener('click', onDocumentClick, true);
      this.destroyRef.onDestroy(() => {
        this.document.removeEventListener('click', onDocumentClick, true);
      });
    });
  }

  /** --- SidebarNavController --- */

  navigationUrl(): string {
    return this.navUrl();
  }

  sidebarCollapsed(): boolean {
    return this.sidebarState.collapsed();
  }

  isNavExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  groupRowActive(match: SidebarNavActiveMatch): boolean {
    return matchNavUrl(this.navUrl(), match);
  }

  onMobileClose(): void {
    this.closeSidebarOnMobile();
  }

  toggleNavGroup(
    group: SidebarNavGroupItem,
    event: MouseEvent,
    variant: 'accordion' | 'flyout',
  ): void {
    if (variant === 'flyout') {
      event.stopPropagation();
    }
    const open = !this.expandedIds().has(group.id);
    if (!open) {
      const remove = idsToCloseWithGroup(group);
      this.expandedIds.update((s) => {
        const next = new Set(s);
        for (const id of remove) {
          next.delete(id);
        }
        return next;
      });
    } else {
      if (variant === 'flyout' && this.topLevelGroupIds().has(group.id)) {
        // Only one top-level flyout open at a time.
        this.expandedIds.set(new Set([group.id]));
        return;
      }

      this.expandedIds.update((s) => new Set(s).add(group.id));
    }
  }

  closeSidebarOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.sidebarState.setCollapsed(true);
    }
  }
}
