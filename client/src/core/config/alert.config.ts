import { InjectionToken } from '@angular/core';
import type { SweetAlertOptions } from 'sweetalert2';

export const ALERT_DEFAULTS = new InjectionToken<SweetAlertOptions>('ALERT_DEFAULTS', {
  providedIn: 'root',
  factory: () => ({
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,
    heightAuto: false,
    buttonsStyling: true,
  }),
});
