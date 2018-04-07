import { GoogleLoginProvider, FacebookLoginProvider, AuthService as SocialAuthService } from 'angular5-social-login';
import {AuthService} from './../shared/auth.service';

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { FormControl, Validators } from '@angular/forms';

@Component({selector: 'login', templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
    rememberMe : boolean = false;

    emailControl = new FormControl('');
    passwordControl = new FormControl('');

    constructor(
        private authService : AuthService, 
        private router : Router, 
        private route : ActivatedRoute,
        private notificationService: NotificationService,
        private socialAuthService: SocialAuthService
    ) {}

    login() {
        if (this.emailControl.invalid || this.passwordControl.invalid) {
            this.notificationService.createSimpleNotification('Login details are invalid or incomplete');
            return;
        }

        this.authService
            .login(this.emailControl.value, this.passwordControl.value, this.rememberMe)
            .subscribe(({status, reason}) => {
                if (status) {
                    this.router.navigateByUrl('/dashboard')
                } else {
                    console.error('error occurred while login', reason);
                    this.notificationService.createSimpleNotification('Invalid Email or Password');
                }
            }, (err) => {
                console.log(err);
            });
    }

    ngOnInit() {
        this.route
            .queryParams
            .subscribe(params => {
                // const errorMessage = params['errorMessage'];
                // if (errorMessage) {
                //     this.notificationService.createSimpleNotification(errorMessage);
                // }
            });

        this.authService.getUserDetails().subscribe(isSuccessful => {
            if(isSuccessful) {
                this.router.navigateByUrl('/dashboard');
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
        .then(({email, name, image, token}) => {
            console.log(socialPlatform+" sign in data : " , {email, name, image, token});
            return this.authService.socialLogin(email, name, token, image, socialPlatform)
                .subscribe(({status, reason}) => {
                    if (status) {
                        this.router.navigateByUrl('/dashboard')
                    } else {
                        console.error('error occurred while login', reason);
                        this.notificationService.createSimpleNotification(reason);
                    }
                }, (err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
      }
}