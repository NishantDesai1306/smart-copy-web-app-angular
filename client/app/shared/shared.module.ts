import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from './notification.service';
import { MaterialModule } from './material.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
    imports: [MaterialModule, ToolbarModule],
    exports: [ToolbarComponent],
    declarations: [],
    providers: [UserService, AuthService, NotificationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
