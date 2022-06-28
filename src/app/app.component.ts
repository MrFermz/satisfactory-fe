import { Component } from '@angular/core'
import { TranslationService } from './modules/i18n'

import { locale as enLang } from './modules/i18n/vocabs/en'
import { locale as thLang } from './modules/i18n/vocabs/th'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'satisfactory-fe'

  constructor(private translationService: TranslationService) {
    this.translationService.loadTranslations(
      enLang,
      thLang
    )
  }
}
