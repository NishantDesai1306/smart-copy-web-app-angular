import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { UsernameFieldComponent } from './username/username.component';
import { EmailFieldComponent } from './email/email.component';
import { PasswordFieldComponent } from './password/password.component';

@NgModule({
    imports: [
        BrowserModule, 
        FormsModule, 
        ReactiveFormsModule,
        MaterialModule
    ],
    exports: [ 
        UsernameFieldComponent,
        EmailFieldComponent,
        PasswordFieldComponent,
    ],
    declarations: [ 
        UsernameFieldComponent,
        EmailFieldComponent,
        PasswordFieldComponent
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormFieldModule { }
