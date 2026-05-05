import { Directive } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Base class for form components: shared validation helpers to reduce boilerplate.
 *
 * Usage:
 * 1. Extend this class in your form component
 * 2. Implement the abstract `form` getter (or a property that satisfies it)
 * 3. Set `submitted = true` when the user attempts submit (e.g. in `ngSubmit`)
 * 4. Use `isFieldInvalid()` and `getFieldError()` in the template
 */
@Directive()
export abstract class BaseForm {
  /** True after the user has attempted to submit (enables error display). */
  submitted = false;

  abstract get form(): FormGroup;

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.f[fieldName];
    if (!field) return false;
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }

  getFieldError(fieldName: string, customMessages?: { [key: string]: string }): string {
    const field = this.f[fieldName];
    if (!field || !field.errors || (!field.dirty && !field.touched && !this.submitted)) {
      return '';
    }

    if (customMessages) {
      for (const errorKey in field.errors) {
        if (customMessages[errorKey]) {
          return customMessages[errorKey];
        }
      }
    }

    const errors = field.errors;
    const fieldLabel = this.formatFieldName(fieldName);

    if (errors['required']) {
      return `${fieldLabel} is required`;
    }
    if (errors['minlength']) {
      return `${fieldLabel} must be at least ${errors['minlength'].requiredLength} characters`;
    }
    if (errors['maxlength']) {
      return `${fieldLabel} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    if (errors['min']) {
      return `${fieldLabel} must be at least ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `${fieldLabel} must not exceed ${errors['max'].max}`;
    }
    if (errors['email']) {
      return `Please enter a valid email address`;
    }
    if (errors['pattern']) {
      return `${fieldLabel} format is invalid`;
    }

    return `${fieldLabel} is invalid`;
  }

  private formatFieldName(fieldName: string): string {
    const result = fieldName.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  hasErrors(): boolean {
    return this.form.invalid;
  }

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  resetForm(): void {
    this.form.reset();
    this.submitted = false;
  }
}
