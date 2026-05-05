import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="h-full min-h-0 grid place-items-center bg-base-200 px-5 py-10 sm:px-8">
      <div class="w-full max-w-xl">
        <div class="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-start sm:text-left">
          <div class="shrink-0">
            <div class="grid place-items-center w-16 h-16 text-neutral">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-10 h-10"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 1.5a4.5 4.5 0 0 0-4.5 4.5V9H6.75A2.25 2.25 0 0 0 4.5 11.25v7.5A3.75 3.75 0 0 0 8.25 22.5h7.5A3.75 3.75 0 0 0 19.5 18.75v-7.5A2.25 2.25 0 0 0 17.25 9H16.5V6A4.5 4.5 0 0 0 12 1.5Zm-3 7.5V6a3 3 0 1 1 6 0v3H9Zm3.75 6a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0V15Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="badge badge-neutral badge-outline">403</span>
              <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">Forbidden</h1>
            </div>
            <p class="mt-2 text-base-content/70 leading-relaxed">
              You do not have permission to access this resource.
              <a class="link link-primary ml-2" routerLink="/home">Back to Home</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Forbidden {}

