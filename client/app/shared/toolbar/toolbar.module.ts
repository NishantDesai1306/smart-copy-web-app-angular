import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MaterialModule } from '../material.module';

@NgModule({
    imports: [
        RouterModule, 
        CommonModule, 
        BrowserModule, 
        MaterialModule
    ],
    exports: [ToolbarComponent],
    declarations: [ToolbarComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ToolbarModule { }
