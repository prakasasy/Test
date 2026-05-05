import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EmptyState } from '../empty-state/empty-state';

@Component({
  selector: 'tr[app-table-empty-row]',
  imports: [EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <td [attr.colspan]="colspan()">
      <app-empty-state
        [title]="title()"
        iconClass="pi pi-inbox"
        iconStyle="font-size: 3rem; color: #9ca3af;"
      />
    </td>
  `,
})
export class TableEmptyRow {
  readonly colspan = input.required<number>();
  readonly title = input.required<string>();
}

