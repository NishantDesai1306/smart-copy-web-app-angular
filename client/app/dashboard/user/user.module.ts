import { FormFieldModule } from './../../shared/form-fields/form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgUploaderModule } from 'ngx-uploader';

import { SharedModule } from './../../shared/shared.module';
import { UserComponent } from './user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [ 
    BrowserModule,
    HttpModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgUploaderModule,

    FormFieldModule
  ],
  declarations: [ 
    UserComponent,
    ChangePasswordComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UserModule { }