import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterModule, Routes } from '@angular/router'

import { Routing } from '../pages/routing'
import { LayoutComponent } from './layout.component'

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: Routing
  }
]


@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LayoutModule { }
