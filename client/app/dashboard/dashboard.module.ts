import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgUploaderModule } from 'ngx-uploader';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from './../shared/shared.module';
import { DashboardCanActivateGuard } from '../app.guards';
import { MainModule } from './main/main.module';
import { UserModule } from './user/user.module';

@NgModule({
  imports: [ 
    BrowserModule,
    HttpModule,
    RouterModule,
    SharedModule,
    FormsModule,

    MainModule,
    UserModule
  ],
  declarations: [ 
    DashboardComponent
  ],
  providers: [
    DashboardCanActivateGuard
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DashboardModule { }