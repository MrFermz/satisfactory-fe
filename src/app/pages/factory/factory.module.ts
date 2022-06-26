import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { FactoryRoutingModule } from './factory-routing.module'
import { FactoryListComponent } from './factory-list/factory-list.component'
import { FactoryActionComponent } from './factory-action/factory-action.component'

import { TableModule } from 'primeng/table'
import { InputNumberModule } from 'primeng/inputnumber'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputSwitchModule } from 'primeng/inputswitch'


@NgModule({
  declarations: [
    FactoryListComponent,
    FactoryActionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FactoryRoutingModule,
    TableModule,
    InputNumberModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    SelectButtonModule,
    InputSwitchModule,
  ]
})
export class FactoryModule { }
