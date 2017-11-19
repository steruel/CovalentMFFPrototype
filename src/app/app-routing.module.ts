import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardProductComponent } from './dashboard-product/dashboard-product.component';
import { ProductOverviewComponent } from './dashboard-product/overview/overview.component';
import { ProductStatsComponent } from './dashboard-product/stats/stats.component';
import { ProductFeaturesComponent } from './dashboard-product/features/features.component';
import { FeaturesFormComponent } from './dashboard-product/features/form/form.component';
import { LogsComponent } from './logs/logs.component';
import { DetailComponent } from './detail/detail.component';
import { LoginComponent } from './login/login.component';
import { FormComponent } from './form/form.component';

import { MMFIntroComponent } from './mmfintro/mmfintro.component';
import { MMFTableExampleComponent } from './mmftableexample/mmftableexample.component';
import { MMFGraphExampleComponent } from './mmfgraphexample/mmfgraphexample.component';
import { ProjDeclarationComponent } from './projdeclaration/projdeclaration.component';
import { ModelDeclarationComponent } from './modeldeclaration/modeldeclaration.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: '',
        component: MainComponent,
        children: [
            {
                component: MMFIntroComponent,
                path: '',
            },
            {
                component: MMFIntroComponent,
                path: 'mmfintro',
            },
            {
                component: ProjDeclarationComponent,
                path: 'projdeclaration',
                //resolve: {
                //    hero: MMFTableExampleComponent,
                //},
            },
            {
                component: ModelDeclarationComponent,
                path: 'modeldeclaration',
            },
            {
                component: MMFTableExampleComponent,
                path: 'mmftableexample',
                //resolve: {
                //    hero: MMFTableExampleComponent,
                //},
            },
            {
                component: MMFGraphExampleComponent,
                path: 'mmfgraphexample',
            },
            {
                path: 'product',
                component: DashboardProductComponent,
                children: [
                    {
                        path: '',
                        component: ProductOverviewComponent
                    },
                    {
                        path: 'stats',
                        component: ProductStatsComponent
                    },
                    {
                        path: 'features',
                        children: [
                            {
                                path: '',
                                component: ProductFeaturesComponent
                            },
                            {
                                path: 'add',
                                component: FeaturesFormComponent
                            },
                            {
                                path: ':id/delete',
                                component: FeaturesFormComponent
                            },
                            {
                                path: ':id/edit',
                                component: FeaturesFormComponent
                            },
                        ]
                    },
                ]
            },
            {
                path: 'item/:id',
                component: DetailComponent
            },
            {
                path: 'logs',
                component: LogsComponent
            },
            {
                path: 'form',
                component: FormComponent
            },
            { path: '', loadChildren: './users/users.module#UsersModule' },
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ]
})
export class AppRoutingModule { }
export const routedComponents: any[] = [
    MainComponent, MMFIntroComponent, ProjDeclarationComponent, ModelDeclarationComponent, MMFTableExampleComponent, MMFGraphExampleComponent, LoginComponent,
    DashboardComponent, DashboardProductComponent,
    FormComponent, LogsComponent, DetailComponent,
    FeaturesFormComponent, ProductFeaturesComponent, ProductOverviewComponent, ProductStatsComponent,
];
