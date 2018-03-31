import { UserService } from './../shared/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './dashboard.Component.html'
})
export class DashboardComponent implements OnInit {

    userSerivce: UserService;
    username: string;

    constructor(userSerivce: UserService) { 
        this.userSerivce = userSerivce;
    }

    ngOnInit() { 
        var self = this;
        self.userSerivce
            .getUser()
            .subscribe((newUser) => {
                self.username = newUser.getUsername(); 
            });
    }
}