import { Routes } from "@angular/router"

const Routing: Routes = [
    {
        path: 'factory',
        loadChildren: () => import('./factory/factory.module').then(m => m.FactoryModule)
    },
    {
        path: '**',
        redirectTo: 'error/404'
    }
]

export { Routing }