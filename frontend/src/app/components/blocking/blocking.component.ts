import { Component, inject } from '@angular/core';
import { blockingDict, BlockingTranslationService } from '../../services/blocking-translation.service';
import { BlockingService } from '../../services/blocking.service';

@Component({
  selector: 'app-blocking',
  standalone: true,
  imports: [],
  templateUrl: './blocking.component.html',
})
export class BlockingComponent {
    dict = inject(BlockingTranslationService).dict;
    public blockingService = inject(BlockingService);

    async ngOnInit() {
      await this.blockingService.reloadList();
    }

    async unblock(target: number) {
        this.blockingService.unblockUser(target);
    }

}
