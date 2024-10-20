import { Component, inject } from '@angular/core';
import { GlobeAmericasComponent } from '../../icons/globe-americas/globe-americas.component';
import { LanguageManagerService } from '../../services/language-manager.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-picker',
  standalone: true,
  imports: [GlobeAmericasComponent, FormsModule],
  templateUrl: './language-picker.component.html',
})
export class LanguagePickerComponent {
    readonly languageService = inject(LanguageManagerService);
}
