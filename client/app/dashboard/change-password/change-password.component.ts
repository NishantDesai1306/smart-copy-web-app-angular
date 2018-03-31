import { UserService } from './../../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/notification.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

    user: any = null;

    newPasswordError = '';
    newPasswordMatchError = '';
    oldPasswordError = '';
    
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
        var self = this;
        
        self.oldPasswordError = '';
        self.newPasswordError = '';
        self.newPasswordMatchError = '';

        if (!self.user.oldPassword) {
            self.oldPasswordError = 'Old Password can`t be empty';
        }
        if (!self.user.newPassword) {
            self.newPasswordError = 'New Password can`t be empty';
        }
        if (self.user.newPassword !== self.user.confirmNewPassword) {
            self.newPasswordMatchError = 'New Password and Confirm New Password must match';
        }

        if (self.oldPasswordError || self.newPasswordError || self.newPasswordMatchError) {
            return;
        }

        self.userService
            .changePassword(self.user.oldPassword, self.user.newPassword)
            .subscribe(res => {
                if(res.status) {
                    this.notificationService.createSimpleNotification('Password Changed Successfully');
                    self.router.navigateByUrl('/dashboard/user');
                }
                else {
                    console.error(res.reason);
                }
            });
    }

    ngOnInit() {
        var self = this;
        self.userService.getUser().subscribe(user => {
            self.user = user;
        });
     }
}