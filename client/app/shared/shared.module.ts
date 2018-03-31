import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from './notification.service';
import { MaterialModule } from './material.module';

@NgModule({
    imports: [MaterialModule],
    exports: [],
    declarations: [],
    providers: [UserService, AuthService, NotificationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
