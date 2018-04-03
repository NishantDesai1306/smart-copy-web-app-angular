import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: './update.component.html'
})
export class UpdateCopiedItemModalComponent {

    constructor(
        public dialogRef : MatDialogRef < UpdateCopiedItemModalComponent >,
        @Inject(MAT_DIALOG_DATA)public item : any
    ) {}

    onCancel() : void {
        this
            .dialogRef
            .close();
    }
}