import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from './notification.service';
import { MaterialModule } from './material.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CopiedItemService } from './copied-item.service';
import { UtilityService } from './utility.service';
import { FormFieldModule } from './form-fields/form-field.module';
import { UsernameFieldComponent } from './form-fields/username/username.component';
import { EmailFieldComponent } from './form-fields/email/email.component';
import { PasswordFieldComponent } from './form-fields/password/password.component';

@NgModule({
    imports: [
        MaterialModule,
        ToolbarModule,
        FormFieldModule
    ],
    exports: [
        ToolbarComponent,
        MaterialModule,
        UsernameFieldComponent,
        EmailFieldComponent,
        PasswordFieldComponent
    ],
    declarations: [],
    providers: [
        AuthService,
        UserService,
        CopiedItemService,
        NotificationService,
        UtilityService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
