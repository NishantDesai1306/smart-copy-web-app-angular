import { CopiedItemService } from './../copied-item.service';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from '../auth.service';

@Component({selector: 'toolbar', templateUrl: './toolbar.component.html'})
export class ToolbarComponent implements OnInit {

    user : any;
    downloadLinks:any = {
        android: {
            name: 'smart-copy-app.apk',
            url: '/app/android/smart-copy-app.apk'
        }
    }
    loading: boolean = false;

    constructor(
        private userService : UserService,
        private authService : AuthService,
        private copiedItemService: CopiedItemService,
        private router : Router
    ) {}

    ngOnInit() {
        this.userService.getUser()
        .subscribe((newUser) => {
            this.user = newUser;
        });
    }

    reloadList() {
        this.loading = true;

        this.copiedItemService.loadItems().subscribe(() => {
            this.loading = false;
        });
    }

    downloadApp(platform) {
        const link = document.createElement("a");
        const info = this.downloadLinks[platform];

        link.download = info.name;
        link.href = info.url;
        link.click();
    }

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
}