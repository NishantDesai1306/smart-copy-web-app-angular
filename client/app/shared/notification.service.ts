import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotificationService {
    defaultDuration = 2000;

    constructor(private snackBar: MatSnackBar) {}

    createSimpleNotification(message: string, duration: number = this.defaultDuration) {
        this.snackBar.open(message, null, {
            duration
        });
    }

    createActionedNotification(message: string, action: string, duration: number = this.defaultDuration) {
        const snackBarRef = this.snackBar.open(message, action, {
            duration
        });

        // use .subscribe(() => { //perform action }) on caller side to perform action
        return snackBarRef.onAction();
    }
}
