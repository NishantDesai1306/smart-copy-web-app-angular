import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../../shared/user.service';
import { NotificationService } from '../../../shared/notification.service';
import { FormControl, Validators } from '@angular/forms';
import { RequiredStateMatcher } from '../../../shared/required-state-matcher';

@Component({
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

    user: any = null;

    newPasswordMatchError = '';

    oldPasswordControl = new FormControl('', [
        Validators.required
    ]);
    newPasswordControl = new FormControl('', [
        Validators.required
    ]);
    
    matcher = new RequiredStateMatcher();
    
    constructor(
        private userService: UserService, 
        private router: Router, 
        private notificationService: NotificationService
    ) {
        this.user = {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''        
        };
    }

    changePassword() {
        this.newPasswordMatchError = '';

        if (this.user.newPassword !== this.user.confirmNewPassword) {
            this.newPasswordMatchError = 'New Password and Confirm New Password must match';
        }

        if (this.newPasswordMatchError) {
            return;
        }

        this.userService
            .changePassword(this.user.oldPassword, this.user.newPassword)
            .subscribe(res => {
                if(res.status) {
                    this.notificationService.createSimpleNotification('Password Changed Successfully');
                    this.router.navigateByUrl('/dashboard/user');
                }
                else {
                    console.error(res.reason);
                }
            });
    }

    ngOnInit() {
        this.userService.getUser().subscribe(user => {
            this.user = user;
        });
     }
}