import { UserService } from './../shared/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './dashboard.Component.html'
})
export class DashboardComponent implements OnInit {

    userService: UserService;
    username: string;

    constructor(userService: UserService) { 
        this.userService = userService;
    }

    ngOnInit() { 
        var self = this;
        self.userService
            .getUser()
            .subscribe((newUser) => {
                self.username = newUser.getUsername(); 
            });
    }
}