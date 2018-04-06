import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../../shared/user.service';
import { NotificationService } from '../../../shared/notification.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

    user: any = null;

    oldPasswordControl = new FormControl('', [
        Validators.required
    ]);
    newPasswordControl = new FormControl('', [
        Validators.required
    ]);
    newConfirmPasswordControl = new FormControl('', [
        Validators.required,
        this.matchesPasswordValidator.bind(this)
    ]);
    
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

    matchesPasswordValidator(control: AbstractControl) {
        if (control.value !== this.newPasswordControl.value) {
            return {
                doesNotMatch: true
            }
        }

        return {};
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