import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { Component, OnInit } from '@angular/core';

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
    emailError = '';
    usernameError = '';
    passwordError = '';

    constructor(private authServie: AuthService, private router: Router) { }

    register() {
        let self = this;
        
        self.emailError = !self.user.email ? 'Email can`t be empty' : '';
        self.usernameError = !self.user.username ? 'Username can`t be empty' : '';
        self.passwordError = self.user.password !== self.user.confirmPassword ? 'Password and Confirm Password must match' : '';

        if (self.emailError || self.usernameError || self.passwordError) {
            return;
        }

        self.authServie
        .register(self.user.email, self.user.username, self.user.password)
        .subscribe((isSuccessfull) => {
            if(isSuccessfull) {
                self.router.navigateByUrl('/dashboard')
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