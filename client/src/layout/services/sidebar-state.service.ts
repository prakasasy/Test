import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateService {
  private readonly _collapsed = signal(false);
  readonly collapsed = this._collapsed.asReadonly();
  readonly expanded = computed(() => !this._collapsed());

  toggle(): void {
    this._collapsed.update((v) => !v);
  }

  setCollapsed(value: boolean): void {
    this._collapsed.set(value);
  }
}
