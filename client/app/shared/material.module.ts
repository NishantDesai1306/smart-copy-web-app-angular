import {
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTooltipModule
} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatInputModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatTooltipModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatInputModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatToolbarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSnackBarModule,
        MatTooltipModule
    ]
})
export class MaterialModule {}