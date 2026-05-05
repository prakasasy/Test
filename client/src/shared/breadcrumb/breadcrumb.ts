import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.css',
  host: {
    class: 'block w-full',
  },
})
export class Breadcrumb {
  /** Ordered trail from root to current page (last segment is styled as current). */
  readonly items = input.required<readonly string[]>();
  readonly ariaLabel = input<string>('Breadcrumb');
}
