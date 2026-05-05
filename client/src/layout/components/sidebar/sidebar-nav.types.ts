export type SidebarNavIconName =
  | 'home'
  | 'briefcase'
  | 'user'
  | 'employee'
  | 'building'
  | 'branch'
  | 'department'
  | 'position';

export type SidebarNavVisibility = {
  /**
   * Show item when the user has ANY of these roles.
   * If omitted/empty, roles do not restrict visibility.
   */
  readonly anyRoles?: readonly string[];

  /**
   * Show item when the user has ANY of these permissions.
   * If omitted/empty, permissions do not restrict visibility.
   */
  readonly anyPermissions?: readonly string[];
};

/** How to highlight a parent group row from the current URL. */
export type SidebarNavActiveMatch =
  | { kind: 'prefix'; value: string }
  | { kind: 'includes'; value: string };

export interface SidebarNavLinkItem {
  readonly kind: 'link';
  readonly label: string;
  readonly path: string;
  readonly icon: SidebarNavIconName;
  readonly visibleWhen?: SidebarNavVisibility;
}

export interface SidebarNavGroupItem {
  readonly kind: 'group';
  readonly id: string;
  readonly label: string;
  readonly icon: SidebarNavIconName;
  readonly activeMatch: SidebarNavActiveMatch;
  readonly children: readonly SidebarNavItem[];
  readonly visibleWhen?: SidebarNavVisibility;
}

export type SidebarNavItem = SidebarNavLinkItem | SidebarNavGroupItem;

/** Top-level section with a rail header (e.g. Management). */
export interface SidebarNavSection {
  readonly id: string;
  readonly label: string;
  readonly icon: SidebarNavIconName;
  readonly activeMatch: SidebarNavActiveMatch;
  readonly children: readonly SidebarNavItem[];
  readonly visibleWhen?: SidebarNavVisibility;
}

export function isNavGroup(item: SidebarNavItem): item is SidebarNavGroupItem {
  return item.kind === 'group';
}

export function isNavLink(item: SidebarNavItem): item is SidebarNavLinkItem {
  return item.kind === 'link';
}
