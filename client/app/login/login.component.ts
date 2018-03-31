import {AuthService} from './../shared/auth.service';

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { NotificationService } from '../shared/notification.service';

@Component({selector: 'login', templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    error : string;
    user : any = {
        email: "nishant",
        password: "nishant"
    };
    rememberMe : boolean = false;

    constructor(
        private authService : AuthService, 
        private router : Router, 
        private route : ActivatedRoute,
        private notificationService: NotificationService
    ) {}

    login() {
        let self = this;

        self.error = "";
        if (!self.user.email) {
            return self.error = "Email can't be empty"
        }
        if (!self.user.password) {
            return self.error = "Password can't be empty"
        }

        self.authService
            .login(self.user.email, self.user.password, self.rememberMe)
            .subscribe(({status, reason}) => {
                if (status) {
                    self.router.navigateByUrl('/dashboard')
                } else {
                    console.error('error occurred while login', reason);
                    self.notificationService.createSimpleNotification(reason && reason.message);
                }
            }, (err) => {
                console.log(err);
                self.error = err;
            });
    }

    ngOnInit() {
        var self = this;

        self.route
            .queryParams
            .subscribe(params => {
                self.error = params['errorMessage'] || '';
            });

        self.authService.getUserDetails().subscribe(isSuccessfull => {
            debugger;
            if(isSuccessfull) {
                self.router.navigateByUrl('/dashboard');
            }
        });
    }
}