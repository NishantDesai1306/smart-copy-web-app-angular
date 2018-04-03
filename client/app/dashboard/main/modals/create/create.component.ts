import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: './create.component.html'
})
export class CreateCopiedItemModalComponent {

    constructor(
        public dialogRef : MatDialogRef < CreateCopiedItemModalComponent >,
        @Inject(MAT_DIALOG_DATA)public item : any
    ) {}

    onCancel() : void {
        this
            .dialogRef
            .close();
    }
}