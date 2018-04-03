import { GoogleLoginProvider, FacebookLoginProvider, AuthService as SocialAuthService } from 'angular5-social-login';
import {AuthService} from './../shared/auth.service';

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { FormControl, Validators } from '@angular/forms';
import { RequiredStateMatcher } from '../shared/required-state-matcher';

@Component({selector: 'login', templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    error : string;
    user : any = {
        email: "",
        password: ""
    };
    rememberMe : boolean = false;

    emailControl = new FormControl('', [
        Validators.required
    ]);
    passwordControl = new FormControl('', [
        Validators.required
    ]);
    
    matcher = new RequiredStateMatcher();

    constructor(
        private authService : AuthService, 
        private router : Router, 
        private route : ActivatedRoute,
        private notificationService: NotificationService,
        private socialAuthService: SocialAuthService
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
            if(isSuccessfull) {
                self.router.navigateByUrl('/dashboard');
            }
        });
    }

    public socialSignIn(socialPlatform : string) {
        let socialPlatformProvider;
        if(socialPlatform == "facebook"){
          socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        }else if(socialPlatform == "google"){
          socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        }
        
        this.socialAuthService.signIn(socialPlatformProvider)
        .then((userData) => {
            console.log(socialPlatform+" sign in data : " , userData);
    
          }
        )
        .catch((err) => {
            console.log(err);
        });
      }
}