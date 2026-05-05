
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## DaisyUI & Tailwind CSS (First Approach)

- **Prefer Tailwind utilities** for layout, spacing, typography, and responsive design (`flex`, `grid`, `gap-*`, `p-*`, `m-*`, `text-*`, `breakpoint:` prefixes).
- **Use DaisyUI component classes first** for common UI: `btn`, `card`, `modal`, `dropdown`, `navbar`, `tabs`, `badge`, `alert`, `input`, `textarea`, `select`, `checkbox`, `radio`, `toggle`, `progress`, `avatar`, `divider`, `mask`, `drawer`, `collapse`, `join`, `stack`, `hero`, `footer`, `stats`, `table`, `artboard`, `countdown`, `kbd`, `link`, `tooltip`.
- **Apply DaisyUI modifiers** for variants: `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-sm`, `card-bordered`, `input-bordered`, `alert-info`, etc. Use the `btn-*`, `badge-*`, `alert-*` semantic color set for consistency.
- **Use DaisyUI themes** for colors and base styling; avoid hardcoding hex/rgb in templates. Prefer theme tokens (e.g. `bg-primary`, `text-secondary`, `border-base-200`) over arbitrary values.
- **Combine utilities with DaisyUI:** use Tailwind for layout/sizing (e.g. `flex-1`, `w-full`, `max-w-md`) and DaisyUI for component semantics (e.g. `btn btn-primary`).
- **Avoid custom CSS** for styling that Tailwind or DaisyUI can express; add custom classes only when no utility or DaisyUI class fits.
- **Responsive and state:** use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and state variants (`hover:`, `focus:`, `active:`, `disabled:`) together with DaisyUI classes where needed.
- **Do NOT** use `ngClass` for conditional classes; use Angular `class` binding or `[class.x]` with Tailwind/DaisyUI class names.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection