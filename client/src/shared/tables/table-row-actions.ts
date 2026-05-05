import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'td[app-table-row-actions]',
  imports: [Button, Tooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-button
      icon="pi pi-pencil"
      styleClass="p-button-text p-button-sm p-button-rounded p-button-info"
      pTooltip="Edit"
      tooltipPosition="top"
      tooltipStyleClass="text-xs max-w-xs"
      [appendTo]="'body'"
      (onClick)="edit.emit(id())"
    />
    <p-button
      icon="pi pi-trash"
      styleClass="p-button-text p-button-sm p-button-rounded p-button-danger"
      pTooltip="Delete"
      tooltipPosition="top"
      tooltipStyleClass="text-xs max-w-xs"
      [appendTo]="'body'"
      (onClick)="delete.emit(id())"
    />
  `,
  host: {
    style: 'text-align: center; padding: 0;',
  },
})
export class TableRowActions {
  readonly id = input.required<string>();
  readonly edit = output<string>();
  readonly delete = output<string>();
}

