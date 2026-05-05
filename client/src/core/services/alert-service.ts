import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import Swal, { type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2/dist/sweetalert2.js';
import { ALERT_DEFAULTS } from '../config/alert.config';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly defaults = inject(ALERT_DEFAULTS);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly swal = Swal.mixin(this.defaults);
  private readonly toastMixin = Swal.mixin({
    toast: true,
    showConfirmButton: false,
    timerProgressBar: true,
  });

  private fire(opts: SweetAlertOptions): Promise<SweetAlertResult<any>> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true } as SweetAlertResult);
    }
    return this.swal.fire(opts);
  }

  success(title: string, text = ''): Promise<SweetAlertResult> {
    return this.fire({ title, text, icon: 'success' });
  }
  error(title: string, text = ''): Promise<SweetAlertResult> {
    return this.fire({ title, text, icon: 'error' });
  }
  warning(title: string, text = ''): Promise<SweetAlertResult> {
    return this.fire({ title, text, icon: 'warning' });
  }
  info(title: string, text = ''): Promise<SweetAlertResult> {
    return this.fire({ title, text, icon: 'info' });
  }

  async confirm(
    title: string,
    text = '',
    options?: Partial<SweetAlertOptions>
  ): Promise<boolean> {
    const result = await this.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      ...options,
    } as SweetAlertOptions);
    return !!result.isConfirmed;
  }

  confirmDanger(title: string, text = '', confirmButtonText = 'Delete'): Promise<boolean> {
    return this.confirm(title, text, {
      confirmButtonText,
      icon: 'warning',
      confirmButtonColor: '#dc2626',
    });
  }

  confirmAsync<T = unknown>(
    title: string,
    text: string,
    handler: () => Promise<T>,
    options?: Partial<SweetAlertOptions>
  ): Promise<SweetAlertResult<T>> {
    return this.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
          return await handler();
        } catch (e: any) {
          Swal.showValidationMessage(e?.message ?? 'Operation failed');
          throw e;
        }
      },
      ...options,
    } as SweetAlertOptions);
  }

  async loading(title = 'Please wait...', text = ''): Promise<() => void> {
    await this.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });
    return () => Swal.close();
  }

  toast(
    title: string,
    text = '',
    {
      icon = 'success',
      timer = 3000,
      position = 'top-end',
      showConfirmButton = false,
    }: {
      icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
      timer?: number;
      position?: SweetAlertOptions['position'];
      showConfirmButton?: boolean;
    } = {}
  ): Promise<SweetAlertResult> {
    return this.toastMixin.fire({ icon, title, text, position, timer, showConfirmButton });
  }
}
