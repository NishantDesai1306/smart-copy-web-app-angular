import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    templateUrl: './delete.component.html'
})
export class DeleteCopiedItemModalComponent {

    constructor(
        public dialogRef : MatDialogRef < DeleteCopiedItemModalComponent >,
        @Inject(MAT_DIALOG_DATA)public item : any
    ) {
        if (item.value && item.value.length >= 50) {
            item.value = item.value.slice(0, 50) + '...';
        }
    }

    onCancel() : void {
        this
            .dialogRef
            .close();
    }
}