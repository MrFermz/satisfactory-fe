import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { FactoryActionComponent } from './factory-action/factory-action.component'
import { FactoryListComponent } from './factory-list/factory-list.component'

const routes: Routes = [
  {
    path: '',
    component: FactoryListComponent
  },
  {
    path: 'create',
    component: FactoryActionComponent
  },
  {
    path: 'edit',
    component: FactoryActionComponent
  },
  {
    path: 'view',
    component: FactoryActionComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoryRoutingModule { }
