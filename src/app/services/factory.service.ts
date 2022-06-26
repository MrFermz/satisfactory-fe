import { Injectable } from '@angular/core'
import { BehaviorSubject, distinctUntilChanged } from 'rxjs'
import { RequestService } from './request.service'

import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  private collection = 'factory'

  constructor() { }

  getFactory(id?: string) {
    let factory: any = []
    if (!localStorage.getItem(this.collection))
      localStorage.setItem(this.collection, JSON.stringify([]))

    if (id) {
      const factoryData = JSON.parse(localStorage.getItem(this.collection) as string)
      factory = factoryData.find((f: any) => f.id === id)

    } else
      factory = JSON.parse(localStorage.getItem(this.collection) as string)

    return factory
  }

  setFactory(data: any, action: string) {
    if (action === 'create') {
      let factory = JSON.parse(localStorage.getItem(this.collection) as string)
      factory.push(data)
      localStorage.setItem(this.collection, JSON.stringify(factory))

    } else if (action === 'edit') {
      const id = data.id
      let factory = JSON.parse(localStorage.getItem(this.collection) as string)
      const i = factory.findIndex((f: any) => f.id === id)
      factory[i] = data
      localStorage.setItem(this.collection, JSON.stringify(factory))

    }
  }

  delFactory(id: string) {
    const factory = JSON.parse(localStorage.getItem(this.collection) as string).filter((f: any) => f.id !== id)
    localStorage.setItem(this.collection, JSON.stringify(factory))
  }

}
