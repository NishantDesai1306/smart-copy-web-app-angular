import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
    templateUrl: './update.component.html'
})
export class UpdateCopiedItemModalComponent {

    copiedItemControl = new FormControl('', [
        Validators.required
    ]);

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