import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { UserComponent } from './dashboard/user/user.component';
import { MainComponent } from './dashboard/main/main.component';
import { DashboardCanActivateGuard } from './app.guards';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
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
    {path: '', redirectTo: '/home', pathMatch: 'full'}
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
