import { DeleteCopiedItemModalComponent } from './modals/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AvatarModule } from 'ng2-avatar';
import { ClipboardModule } from 'ngx-clipboard';

import { MainComponent } from './main.component';
import { SharedModule } from './../../shared/shared.module';
import { CreateCopiedItemModalComponent } from './modals/create/create.component';
import { UpdateCopiedItemModalComponent } from './modals/update/update.component';

@NgModule({
  imports: [ 
    BrowserModule,
    HttpModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    ClipboardModule,
    AvatarModule.forRoot()
  ],
  entryComponents: [
    CreateCopiedItemModalComponent,
    UpdateCopiedItemModalComponent,
    DeleteCopiedItemModalComponent
  ],
  declarations: [ 
    MainComponent,
    CreateCopiedItemModalComponent,
    UpdateCopiedItemModalComponent,
    DeleteCopiedItemModalComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainModule { }