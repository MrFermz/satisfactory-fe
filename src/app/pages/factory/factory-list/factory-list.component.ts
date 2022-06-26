import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FactoryService } from 'src/app/services/factory.service'

import * as _ from 'lodash'

@Component({
  selector: 'app-factory-list',
  templateUrl: './factory-list.component.html',
  styleUrls: ['./factory-list.component.scss']
})
export class FactoryListComponent implements OnInit {

  // Factory
  factoryData: any = []

  constructor(
    private $factory: FactoryService,
    private router: Router
  ) {
    this.factoryData = $factory.getFactory()
    console.log(`🦄🦄🦄: FactoryListComponent -> this.factoryData`, this.factoryData)
  }

  ngOnInit(): void {
  }

  onAction(action: string, id: string) {
    this.router.navigate([action], {
      queryParams: { id: id }
    })
  }

  onDelete(id: string) {
    this.$factory.delFactory(id)
    this.factoryData = this.$factory.getFactory()
  }

  sumBy(data: any, by: any) {
    if (!_.sumBy(data, by))
      return '-'
    return _.sumBy(data, by)
  }

}
