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
    MatTooltipModule,
    MatDividerModule
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
        MatTooltipModule,
        MatDividerModule
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
        MatTooltipModule,
        MatDividerModule
    ]
})
export class MaterialModule {}