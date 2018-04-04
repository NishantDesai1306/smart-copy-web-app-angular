import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UtilityService } from '../../../../shared/utility.service';

@Component({
    templateUrl: './delete.component.html'
})
export class DeleteCopiedItemModalComponent {

    constructor(
        public dialogRef : MatDialogRef < DeleteCopiedItemModalComponent >,
        @Inject(MAT_DIALOG_DATA)public item : any,
        private utilityService: UtilityService
    ) {
        item.value = utilityService.truncateString(item.value);
    }

    onCancel() : void {
        this
            .dialogRef
            .close();
    }
}