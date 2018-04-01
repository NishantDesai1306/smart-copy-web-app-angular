import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from '../auth.service';

@Component({selector: 'toolbar', templateUrl: './toolbar.component.html'})
export class ToolbarComponent implements OnInit {

    user : any;

    constructor(private userService : UserService, private authService : AuthService, private router : Router) {}

    logout() {
        this.authService.logout()
        .subscribe((data) => {
            if (data.status) {
                this
                    .router
                    .navigateByUrl('/login')
            } else {
                console.error(data.reason);
            }
        }, (err) => {
            console.error(err);
        });
    }

    ngOnInit() {
        this.userService.getUser()
        .subscribe((newUser) => {
            this.user = newUser;
        });
    }
}