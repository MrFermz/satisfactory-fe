import { Component, OnInit } from '@angular/core'
import { FactoryService } from 'src/app/services/factory.service'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestService } from 'src/app/services/request.service'

import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'

@Component({
  selector: 'app-factory-action',
  templateUrl: './factory-action.component.html',
  styleUrls: ['./factory-action.component.scss']
})
export class FactoryActionComponent implements OnInit {

  action: any
  qualityArr: any = [
    {
      name: 'Impure',
      value: 'impure'
    },
    {
      name: 'Normal',
      value: 'normal'
    },
    {
      name: 'Pure',
      value: 'pure'
    }
  ]
  displayModal: boolean = false

  factoryName: string = ''
  factoryId: string = ''
  factoryLocked: boolean = false

  // Building
  buidingData: any = []

  // Item
  itemData: any = []

  // Factory
  factoryData: any = []

  constructor(
    private $factory: FactoryService,
    private router: Router,
    private route: ActivatedRoute,
    private request: RequestService
  ) {
    const urlArr = router.url.split('/')
    this.action = urlArr[urlArr.length - 1].split('?')[0].toLowerCase()


  }

  async ngOnInit() {
    const buildingRes: any = await this.request.getBuilding().toPromise()
    this.buidingData = buildingRes.data
    const itemRes: any = await this.request.getItems().toPromise()
    this.itemData = itemRes.data

    if (this.action === 'create') {
      this.factoryId = uuidv4()
    } else {
      this.factoryId = this.route.snapshot.queryParamMap.get('id') as string
      const factory = this.$factory.getFactory(this.factoryId)
      this.factoryName = factory.name
      this.factoryData = factory.data
      this.factoryLocked = factory.locked

    }

  }

  addBuilding() {
    this.factoryData.push({
      uuid: uuidv4(),
      mk: 1,
      quality: 'impure',
      outputMultiple: 1
    })
  }

  itemDataFiltered(id: any) {
    return this.itemData.filter((item: any) => item.produced.includes(id))
  }

  onChangeBuilding(event: any, i: any) {
    const value = event.value
    this.factoryData[i].inputId = null
    this.factoryData[i].input = null
    this.factoryData[i].outputId = null
    this.factoryData[i].output = null
  }

  onChangeOutput(event: any, i: any) {
    const value = event.value
    this.factoryData[i].outputId = value
    this.factoryData[i].output = this.itemData[value]
    this.factoryData[i].outputRate = this.factoryData[i]?.output?.rate[this.factoryData[i].quality] * this.factoryData[i].outputMultiple
  }

  onChangeQuality(event: any, i: any) {
    this.factoryData[i].outputRate = this.factoryData[i]?.output?.rate[this.factoryData[i].quality] * this.factoryData[i].outputMultiple
  }

  onInputMk(event: any, i: any) {
    const value = event.value
    let times = 1
    if (value === 1) times = 1
    else if (value === 2) times = 2
    else if (value === 3) times = 4

    this.factoryData[i].outputMultiple = times
    this.factoryData[i].outputRate = this.factoryData[i]?.output?.rate[this.factoryData[i].quality] * this.factoryData[i].outputMultiple
  }

  onSave(redirect?: boolean) {
    this.$factory.setFactory({
      id: this.factoryId,
      name: this.factoryName,
      data: this.factoryData,
      locked: this.factoryLocked
    }, this.action)

    if (redirect)
      this.router.navigate(['/factory'])
  }

  onDeleteBuilding(i: any) {
    this.factoryData.splice(i, 1)
  }

  numSequence(n: number): Array<number> {
    return Array(n)
  }

  sumBy(data: any, by: any) {
    if (!_.sumBy(data, by))
      return '-'
    return _.sumBy(data, by)
  }
}
