import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Message } from 'primeng/message';

/**
 * Single field validation message (PrimeNG error style). Renders nothing when message is empty.
 * Use with the control’s `aria-describedby` pointing at `controlErrorId`.
 */
@Component({
  selector: 'app-field-error-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Message],
  template: `
    @if (hasText()) {
      <div [attr.id]="controlErrorId()" role="alert">
        <p-message severity="error" variant="simple" size="small" styleClass="w-full">
          {{ message() }}
        </p-message>
      </div>
    }
  `,
})
export class FieldErrorMessage {
  readonly message = input<string>('');
  readonly controlErrorId = input<string | null>(null);

  readonly hasText = computed(() => this.message().trim().length > 0);
}
