import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { UserComponent } from './dashboard/user/user.component';
import { MainComponent } from './dashboard/main/main.component';
import { DashboardCanActivateGuard } from './app.guards';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
    {
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [DashboardCanActivateGuard], 
        children: [
            {path: '', redirectTo: '/dashboard/main', pathMatch: 'full'},
            {path: 'main', component: MainComponent},
            {path: 'user', component: UserComponent},
            {path: 'change-password', component: ChangePasswordComponent}
        ]
    },
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
