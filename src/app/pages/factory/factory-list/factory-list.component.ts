import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FactoryService } from 'src/app/services/factory.service'
import { ConfirmationService } from 'primeng/api'

import * as _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-factory-list',
  templateUrl: './factory-list.component.html',
  styleUrls: ['./factory-list.component.scss'],
  providers: [ConfirmationService]
})
export class FactoryListComponent implements OnInit {

  // Factory
  factoryData: any = []

  constructor(
    private $factory: FactoryService,
    private router: Router,
    private $confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.factoryData = this.$factory.getFactory()
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

  onClone(id: string) {
    const factory = this.$factory.getFactory(id)
    const cloneFactory = _.cloneDeep({
      id: uuidv4(),
      name: `${factory.name} (copy)`,
      data: factory.data,
      locked: factory.locked
    })

    this.$factory.setFactory(cloneFactory, 'create')
    this.factoryData = this.$factory.getFactory()
  }

  onCloneConfirm(id: string) {
    this.$confirmationService.confirm({
      header: 'Confirmation',
      message: 'Do you want to clone this record?',
      icon: 'pi pi-info-circle',
      accept: () => { this.onClone(id) },
      reject: (type: any) => { }
    })
  }

  onDeleteConfirm(id: string) {
    this.$confirmationService.confirm({
      header: 'Confirmation',
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      accept: () => { this.onDelete(id) },
      reject: (type: any) => { }
    })
  }

  sumBy(data: any, by: any) {
    if (!_.sumBy(data, by))
      return '-'
    return _.sumBy(data, by)
  }

}
