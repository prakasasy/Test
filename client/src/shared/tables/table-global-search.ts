import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-table-global-search',
  imports: [InputText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex justify-end py-1">
      <div
        class="flex w-52 min-w-0 max-w-full items-stretch overflow-hidden rounded-lg border border-base-300 bg-base-100 sm:w-60"
      >
        <span
          class="flex shrink-0 items-center border-r border-base-200 bg-base-200/40 px-2.5 text-base-content/60"
          aria-hidden="true"
        >
          <i class="pi pi-search text-sm"></i>
        </span>
        <input
          pInputText
          type="search"
          [placeholder]="placeholder()"
          autocomplete="off"
          [attr.aria-label]="ariaLabel()"
          class="min-w-0 flex-1 rounded-none border-0 !border-0 bg-transparent !shadow-none outline-none focus:ring-0 focus:outline-none"
          (input)="valueChange.emit(($any($event.target).value ?? '').toString())"
        />
      </div>
    </div>
  `,
})
export class TableGlobalSearch {
  readonly placeholder = input<string>('Search…');
  readonly ariaLabel = input.required<string>();
  readonly valueChange = output<string>();
}

