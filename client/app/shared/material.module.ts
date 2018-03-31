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
    MatSnackBarModule
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
        MatSnackBarModule
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
        MatSnackBarModule
    ]
})
export class MaterialModule {}