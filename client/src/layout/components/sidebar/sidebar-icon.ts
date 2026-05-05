import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { SidebarNavIconName } from './sidebar-nav.types';

@Component({
  selector: 'app-sidebar-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex shrink-0 items-center justify-center text-white',
    '[class.h-8]': 'size() === "md"',
    '[class.w-8]': 'size() === "md"',
    '[class.h-6]': 'size() === "sm"',
    '[class.w-6]': 'size() === "sm"',
  },
  template: `
    @switch (name()) {
      @case ('home') {
        <svg
          class="text-current"
          [class.h-5]="size() === 'md'"
          [class.w-5]="size() === 'md'"
          [class.h-4]="size() === 'sm'"
          [class.w-4]="size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      }
      @case ('briefcase') {
        <svg
          class="text-current"
          [class.h-5]="size() === 'md'"
          [class.w-5]="size() === 'md'"
          [class.h-4]="size() === 'sm'"
          [class.w-4]="size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      }
      @case ('user') {
        <svg
          class="text-current"
          [class.h-4]="size() === 'md' || size() === 'sm'"
          [class.w-4]="size() === 'md' || size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
      @case ('employee') {
        <svg
          class="text-current"
          [class.h-4]="size() === 'md' || size() === 'sm'"
          [class.w-4]="size() === 'md' || size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
      @case ('building') {
        <svg
          class="text-current"
          [class.h-4]="size() === 'md' || size() === 'sm'"
          [class.w-4]="size() === 'md' || size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      @case ('branch') {
        <svg
          class="text-current"
          [class.h-4]="size() === 'md' || size() === 'sm'"
          [class.w-4]="size() === 'md' || size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }
      @case ('department') {
        <svg
          class="text-current"
          [class.h-4]="size() === 'md' || size() === 'sm'"
          [class.w-4]="size() === 'md' || size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      }
      @case ('position') {
        <svg
          class="text-current"
          [class.h-4]="size() === 'md' || size() === 'sm'"
          [class.w-4]="size() === 'md' || size() === 'sm'"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 16h.01" />
        </svg>
      }
    }
  `,
})
export class SidebarIcon {
  readonly name = input.required<SidebarNavIconName>();
  readonly size = input<'md' | 'sm'>('sm');
}
