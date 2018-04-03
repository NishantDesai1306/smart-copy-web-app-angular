import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RequiredStateMatcher } from '../../shared/required-state-matcher';

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    user: any = {
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    }

    passwordError: any = '';

    emailControl = new FormControl('', [
        Validators.required
    ]);
    usernameControl = new FormControl('', [
        Validators.required
    ]);
    passwordControl = new FormControl('', [
        Validators.required
    ]);
    
    matcher = new RequiredStateMatcher();

    constructor(private authService: AuthService, private router: Router) { }

    register() {
        this.passwordError = this.user.password !== this.user.confirmPassword ? 'Password and Confirm Password must match' : '';

        if (this.passwordError) {
            return;
        }

        this.authService
        .register(this.user.email, this.user.username, this.user.password)
        .subscribe((isSuccessfull) => {
            if(isSuccessfull) {
                this.router.navigateByUrl('/dashboard')
            }
            else {
                console.error('error occurred while login');
            }
        }, (err) => {
            console.error(err);
        });
    }

    ngOnInit() { }
}