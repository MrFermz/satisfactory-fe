import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

export interface Locale {
  lang: string
  data: any
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language'

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private langIds: any = []

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en'])

    this.translate.setDefaultLang('en')
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args]

    locales.forEach((locale) => {
      this.translate.setTranslation(locale.lang, locale.data, true)
      this.langIds.push(locale.lang)
    })

    this.translate.addLangs(this.langIds)
    this.translate.use(this.getSelectedLanguage())
  }

  setLanguage(lang: string) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang())
      this.translate.use(lang)
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang)
    }
  }

  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    )
  }
}
