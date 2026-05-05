import type {
  SidebarNavActiveMatch,
  SidebarNavGroupItem,
  SidebarNavItem,
  SidebarNavVisibility,
} from './sidebar-nav.types';
import { isNavGroup } from './sidebar-nav.types';
import { isAllowed } from '../../../core/auth/authorization';

export function matchNavUrl(url: string, match: SidebarNavActiveMatch): boolean {
  switch (match.kind) {
    case 'prefix':
      return url.startsWith(match.value);
    case 'includes':
      return url.includes(match.value);
  }
}

/** All nested group ids under `items` (not including siblings at root of `items`). */
export function collectDescendantGroupIds(items: readonly SidebarNavItem[]): string[] {
  const ids: string[] = [];
  for (const item of items) {
    if (isNavGroup(item)) {
      ids.push(item.id, ...collectDescendantGroupIds(item.children));
    }
  }
  return ids;
}

/** When collapsing `group`, remove these ids from the expanded set. */
export function idsToCloseWithGroup(group: SidebarNavGroupItem): string[] {
  return [group.id, ...collectDescendantGroupIds(group.children)];
}

export function maxAccordionHeightRem(items: readonly SidebarNavItem[]): number {
  let rows = 0;
  const walk = (list: readonly SidebarNavItem[]): void => {
    for (const item of list) {
      rows += 1;
      if (isNavGroup(item)) {
        walk(item.children);
      }
    }
  };
  walk(items);
  return Math.max(12, rows * 2.75 + 4);
}

export type SidebarNavVisibilityContext = {
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
};

export function isSidebarNavVisible(
  visibleWhen: SidebarNavVisibility | undefined,
  ctx: SidebarNavVisibilityContext,
): boolean {
  return isAllowed(ctx, visibleWhen);
}

export function filterSidebarNavItems(
  items: readonly SidebarNavItem[],
  ctx: SidebarNavVisibilityContext,
): readonly SidebarNavItem[] {
  const out: SidebarNavItem[] = [];

  for (const item of items) {
    if (!isSidebarNavVisible(item.visibleWhen, ctx)) {
      continue;
    }

    if (isNavGroup(item)) {
      const children = filterSidebarNavItems(item.children, ctx);
      if (children.length === 0) continue;
      out.push({ ...item, children });
    } else {
      out.push(item);
    }
  }

  return out;
}
