import { SharedModule } from './../shared/shared.module';

import {RegisterComponent} from './register/register.component';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {LoginComponent} from './login.component';
import {LoginRoutingModule} from './login.routing';
import { getAuthServiceConfigs } from './AuthService.config';

import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    FacebookLoginProvider,
} from "angular5-social-login";

@NgModule({
    imports: [
        BrowserModule, 
        FormsModule, 
        BrowserAnimationsModule,
        ReactiveFormsModule,
        
        LoginRoutingModule,
        SharedModule,

        SocialLoginModule
    ],
    declarations: [
        LoginComponent, 
        RegisterComponent
    ],
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: getAuthServiceConfigs
        }
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LoginModule {}