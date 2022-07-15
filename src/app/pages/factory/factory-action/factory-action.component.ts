import { Component, OnInit } from '@angular/core'
import { FactoryService } from 'src/app/services/factory.service'
import { ActivatedRoute, Router } from '@angular/router'
import { RequestService } from 'src/app/services/request.service'
import { ConfirmationService } from 'primeng/api'

import { v4 as uuidv4 } from 'uuid'
import * as _ from 'lodash'

@Component({
  selector: 'app-factory-action',
  templateUrl: './factory-action.component.html',
  styleUrls: ['./factory-action.component.scss'],
  providers: [ConfirmationService]
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
    private request: RequestService,
    private $confirmationService: ConfirmationService
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
      outputMultiple: 1
    })
  }

  itemDataFiltered(id: string, type: string) {
    if (type)
      return this.itemData.filter((item: any) => item[type].includes(id))
    return this.itemData
  }

  onChangeBuilding(event: any, i: number) {
    const value = event.value
    if (value?.haveQuality === true)
      this.factoryData[i].quality = 'impure'
    this.factoryData[i].inputId = null
    this.factoryData[i].input = null
    this.factoryData[i].outputId = null
    this.factoryData[i].output = null
  }

  onChangeInput(event: any, i: number, j: number) {
    const value = event.value
    if (!value) {
      this.factoryData[i].inputId = null
      this.factoryData[i].input = null
      this.factoryData[i].inputRate = null
      this.factoryData[i].originalInputRate = null
      return
    }

    const buildingId = this.factoryData[i].building.id
    this.factoryData[i][`input${j}`] = {}
    this.factoryData[i][`input${j}`].inputId = value
    this.factoryData[i][`input${j}`].input = this.itemData[value.id - 1]

    if (this.factoryData[i][`input${j}`]?.input?.inputRate) {
      let inputRate = this.factoryData[i][`input${j}`].input.inputRate
      if (this.factoryData[i][`input${j}`].input.inProduced.length > 0)
        inputRate = this.factoryData[i][`input${j}`].input.inputRate[buildingId]
      this.factoryData[i][`input${j}`].inputRateOrigin = inputRate
      this.factoryData[i][`input${j}`].inputRate = inputRate.in
    }

    this.factoryData[i][`input${j}`].originalInputRate = _.cloneDeep(this.factoryData[i][`input${j}`].inputRate)
  }

  onChangeOutput(event: any, i: number) {
    const value = event.value
    if (!value) {
      this.factoryData[i].outputId = null
      this.factoryData[i].output = null
      this.factoryData[i].outputRate = null
      this.factoryData[i].originalOutputRate = null
      return
    }

    const buildingId = this.factoryData[i].building.id
    this.factoryData[i].outputId = value
    this.factoryData[i].output = this.itemData[value.id - 1]

    if (this.factoryData[i]?.output?.outputRate) {
      let outputRate = this.factoryData[i].output.outputRate
      if (this.factoryData[i].output.outProduced.length > 1)
        outputRate = this.factoryData[i].output.outputRate[buildingId]
      if (typeof outputRate === 'number')
        this.factoryData[i].outputRate = outputRate * this.factoryData[i].outputMultiple
      else
        this.factoryData[i].outputRate = outputRate[this.factoryData[i].quality] * this.factoryData[i].outputMultiple

    } else if (this.factoryData[i]?.input?.inputRate) {
      this.factoryData[i].outputRate = this.factoryData[i].inputRateOrigin.out
    }
    console.log(`🦄🦄🦄: onChangeOutput -> this.factoryData[i]`, this.factoryData[i])

    this.factoryData[i].originalOutputRate = _.cloneDeep(this.factoryData[i].outputRate)
  }

  onChangeQuality(event: any, i: number) {
    const buildingId = this.factoryData[i].building.id

    if (this.factoryData[i]?.output?.outputRate) {
      let outputRate = this.factoryData[i].output.outputRate
      if (this.factoryData[i].output.produced.length > 1)
        outputRate = this.factoryData[i].output.outputRate[buildingId]
      if (typeof outputRate === 'number')
        this.factoryData[i].outputRate = outputRate * this.factoryData[i].outputMultiple
      else
        this.factoryData[i].outputRate = outputRate[this.factoryData[i].quality] * this.factoryData[i].outputMultiple
    }

    this.factoryData[i].originalOutputRate = _.cloneDeep(this.factoryData[i].outputRate)
  }

  onInputMk(event: any, i: number) {
    const value = event.value
    let times = 1
    if (value === 1) times = 1
    else if (value === 2) times = 2
    else if (value === 3) times = 4

    this.factoryData[i].outputMultiple = times
    this.factoryData[i].outputRate = this.factoryData[i]?.output?.outputRate[this.factoryData[i].quality] * this.factoryData[i].outputMultiple
    this.factoryData[i].originalOutputRate = _.cloneDeep(this.factoryData[i].outputRate)
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

  onDeleteBuilding(i: number) {
    this.factoryData.splice(i, 1)
  }

  onDeleteBuildingConfirm(event: any, i: number) {
    this.$confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => { this.onDeleteBuilding(i) },
      reject: () => { }
    })
  }

  onResetOutputRate(i: number) {
    this.factoryData[i].outputRate = _.cloneDeep(this.factoryData[i].originalOutputRate)
  }

  onResetInputRate(i: number) {
    this.factoryData[i].inputRate = _.cloneDeep(this.factoryData[i].originalInputRate)
  }

  onCloneBuilding(i: number) {
    const building = _.cloneDeep(this.factoryData[i])
    const cloneBuilding = _.cloneDeep({
      ...building,
      uuid: uuidv4()
    })
    this.factoryData.push(cloneBuilding)
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
