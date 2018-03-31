import { SharedModule } from './../shared/shared.module';

import {RegisterComponent} from './register/register.component';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login.routing';
import { MaterialModule } from '../shared/material.module';


@NgModule({
    imports: [
        BrowserModule, 
        FormsModule, 
        LoginRoutingModule,
        SharedModule,

        MaterialModule,
        FlexLayoutModule,
        BrowserAnimationsModule
    ],
    declarations: [
        LoginComponent, 
        RegisterComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LoginModule {}