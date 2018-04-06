import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { NotificationService } from './../../shared/notification.service';
import { AuthService } from './../../shared/auth.service';


@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    emailControl = new FormControl('', [
        Validators.required,
        Validators.email
    ], this.validateEmailNotTaken.bind(this));
    usernameControl = new FormControl('', [
        Validators.required
    ], this.validateUsernameNotTaken.bind(this));
    passwordControl = new FormControl('', [
        Validators.required
    ]);
    confirmPasswordControl = new FormControl('', [
        Validators.required,
        this.matchesPasswordValidator.bind(this)
    ]);
    
    constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) { }

    ngOnInit() { }
    
    validateEmailNotTaken(control: AbstractControl) {
        return this.authService.validateEmail(control.value).map(res => {
            if (!res.data) {
                return {
                    emailAlreadyRegistered: true
                };
            }

            return {};
        });
    }

    validateUsernameNotTaken(control: AbstractControl) {
        return this.authService.validateUsername(control.value).map(res => {
            if (!res.data) {
                return {
                    usernameAlreadyRegistered: true
                };
            }

            return {};
        });
    }

    matchesPasswordValidator(control: AbstractControl) {
        if (control.value !== this.passwordControl.value) {
            return {
                doesNotMatch: true
            }
        }

        return {};
    }

    register() {
        if (this.emailControl.invalid || this.usernameControl.invalid || this.passwordControl.invalid || this.confirmPasswordControl.invalid) {
            this.notificationService.createSimpleNotification('User details are incomplete or invalid');            
            return;
        }

        this.authService
        .register(this.emailControl.value, this.usernameControl.value, this.passwordControl.value)
        .subscribe((isSuccessful) => {
            if(isSuccessful) {
                this.router.navigateByUrl('/dashboard')
            }
            else {
                console.error('error occurred while login');
            }
        }, (err) => {
            console.error(err);
        });
    }
}