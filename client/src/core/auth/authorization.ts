export type AuthzContext = {
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
};

export type AuthzRule = {
  /** Allow when user has ANY of these roles (optional). */
  readonly anyRoles?: readonly string[];
  /** Allow when user has ANY of these permissions (optional). */
  readonly anyPermissions?: readonly string[];
};

export function isAllowed(ctx: AuthzContext, rule?: AuthzRule): boolean {
  if (!rule) return true;

  const anyRoles = rule.anyRoles?.filter(Boolean) ?? [];
  if (anyRoles.length > 0) {
    const ok = anyRoles.some((r) => ctx.roles.includes(r));
    if (!ok) return false;
  }

  const anyPermissions = rule.anyPermissions?.filter(Boolean) ?? [];
  if (anyPermissions.length > 0) {
    const ok = anyPermissions.some((p) => ctx.permissions.includes(p));
    if (!ok) return false;
  }

  return true;
}

