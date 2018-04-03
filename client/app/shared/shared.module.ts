import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from './notification.service';
import { MaterialModule } from './material.module';
import { ToolbarModule } from './toolbar/toolbar.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CopiedItemService } from './copied-item.service';

@NgModule({
    imports: [MaterialModule, ToolbarModule],
    exports: [ToolbarComponent, MaterialModule],
    declarations: [],
    providers: [AuthService, UserService, CopiedItemService, NotificationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
