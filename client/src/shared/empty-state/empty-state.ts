import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly iconClass = input.required<string>();
  readonly iconStyle = input.required<string>();
  readonly description = input<string | null>(null);
}
