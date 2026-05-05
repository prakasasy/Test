import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-initial-splash',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './initial-splash.html',
  styleUrl: './initial-splash.css',
})
export class InitialSplash {
  /**
   * When true, applies the hiding animation (fade out).
   * The parent should keep the component mounted until the transition ends.
   */
  @Input() hiding = false;
}
