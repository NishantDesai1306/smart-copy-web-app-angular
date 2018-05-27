import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../../shared/user.service';
import { NotificationService } from '../../../shared/notification.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
    templateUrl: './change-password.component.html',
    styles: [`
        :host {
            display: flex;
            flex: 1;
            flex-direction: column
        }`
    ]
})
export class ChangePasswordComponent implements OnInit {

    user: any = null;

    oldPasswordControl = new FormControl('');
    newPasswordControl = new FormControl('');
    newConfirmPasswordControl = new FormControl('');
    
    constructor(
        private userService: UserService, 
        private router: Router, 
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.userService.getUser().subscribe(user => {
            this.user = user;
        });
    }

    changePassword() {
        if (
            (!this.user.getSocial() && this.oldPasswordControl.invalid) ||
            this.newPasswordControl.invalid ||
            this.newConfirmPasswordControl.invalid
        ) {
            this.notificationService.createSimpleNotification('Change password details are incomplete or invalid');
            return;
        }

        this.userService
            .changePassword(this.oldPasswordControl.value, this.newPasswordControl.value)
            .subscribe(res => {
                if(res.status) {
                    this.userService.setUser(this.user.getUsername(), this.user.getEmail(), this.user.getProfilePictureUrl(), null);
                    this.notificationService.createSimpleNotification('Password Changed Successfully');
                    this.router.navigateByUrl('/dashboard/user');
                }
                else {
                    console.error(res.reason);
                    this.notificationService.createSimpleNotification(res.reason);
                }
            });
    }
}