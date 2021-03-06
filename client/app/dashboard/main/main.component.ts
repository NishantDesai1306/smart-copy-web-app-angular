import { DeleteCopiedItemModalComponent } from './modals/delete/delete.component';
import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'ng2-avatar';

import { CopiedItemService, CopiedItem } from '../../shared/copied-item.service';
import { CreateCopiedItemModalComponent } from './modals/create/create.component';
import { UpdateCopiedItemModalComponent } from './modals/update/update.component';
import { NotificationService } from '../../shared/notification.service';
import { UtilityService } from '../../shared/utility.service';

@Component({
    templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {
    copiedItems: CopiedItem[];
    loadingData: boolean = true;

    constructor(
        private copiedItemService: CopiedItemService,
        private dialog: MatDialog,
        private notificationService: NotificationService,
        private utilityService: UtilityService
    ) {
        this.copiedItemService.getItems().subscribe((copiedItems) => {
            this.copiedItems = copiedItems;
            this.loadingData = false;
        });
    }

    ngOnInit() { }

    onAddItem() {
        const dialogRef = this.dialog.open(CreateCopiedItemModalComponent, {
            minWidth: '50%',
            data: { value: '' }
        });
      
        dialogRef.afterClosed().subscribe(item => {
            if (item) {
                this.copiedItemService
                    .insertItem(item)
                    .subscribe((data) => { console.log(data); });
            }
        });
    }

    onUpdateItem(id) {
        const selectedCopiedItem = this.copiedItems.find(({_id}) => id === _id);

        if (!selectedCopiedItem) {
            return window.location.reload();
        }

        const dialogRef = this.dialog.open(UpdateCopiedItemModalComponent, {
            minWidth: '50%',
            data: { value: selectedCopiedItem.getValue() }
        });
      
        dialogRef.afterClosed().subscribe(item => {
            if (item) {
                this.copiedItemService
                    .updateItem(selectedCopiedItem.getId(), item)
                    .subscribe((data) => { console.log(data); });
            }
        });
    }

    onDeleteItem(id) {
        const selectedCopiedItem = this.copiedItems.find(({_id}) => id === _id);

        if (!selectedCopiedItem) {
            return window.location.reload();
        }

        const dialogRef = this.dialog.open(DeleteCopiedItemModalComponent, {
            minWidth: '300px',
            data: { value: selectedCopiedItem.getValue() }
        });
      
        dialogRef.afterClosed().subscribe(shouldDelete => {
            if (shouldDelete) {
                this.copiedItemService
                    .deleteItem(selectedCopiedItem.getId())
                    .subscribe((data) => { console.log(data); });
            }
        });
    }

    onCopy(value: string) {
        const formatedText = this.utilityService.truncateString(value, 100);
        this.notificationService.createSimpleNotification(`${formatedText} copied to your clipboard.`);
    }

    log(e) {
        console.log(e);
    }
}