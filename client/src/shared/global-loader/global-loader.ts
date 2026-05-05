import { Component, computed, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading-service';

@Component({
  selector: 'app-global-loader',
  imports: [],
  templateUrl: './global-loader.html',
  styleUrl: './global-loader.css',
})
export class GlobalLoader {
  private loader = inject(LoadingService);
  isLoading = computed(() => {
    const loading = this.loader.isLoading();
    return loading;
  });
}
