import { HttpContextToken, HttpContext } from '@angular/common/http';

/** Set this to true on a request to skip the global loader overlay for that call. */
export const SKIP_GLOBAL_LOADER = new HttpContextToken<boolean>(() => false);

/** Optional: set a custom message if you also show a message (not used by overlay below). */
export const LOADER_MESSAGE = new HttpContextToken<string>(() => 'Loading…');

/** Shorthand to create a context that skips the global loader. */
export function withNoLoader(ctx = new HttpContext()): HttpContext {
  return ctx.set(SKIP_GLOBAL_LOADER, true);
}
