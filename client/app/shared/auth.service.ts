import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {

    private username: string;
    private email: string;
    readonly authUrl: string = '/auth';
    private isLoggedIn: boolean = false;
    
    constructor(private http: Http, 
        private userService: UserService) {}

    isUserLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    login (email: string, password: string, rememberMe: boolean) {
        let self = this;
        let loginUrl: string = this.authUrl + '/login';

        return self.http.post(loginUrl, {email, password, rememberMe})
            .map((res:Response) => res.json())
            .map((res) => {
                self.isLoggedIn = res.status;
                if(self.isLoggedIn) {
                    self.userService.setUser(res.data.username, res.data.email, res.data.profilePictureUrl);
                }

                return res;
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    socialLogin (email: string, username: string, token: string, imageUrl: string, source: string) {
        let self = this;
        let loginUrl: string = this.authUrl + '/social-login';

        return self.http.post(loginUrl, {email, username, token, imageUrl, source})
            .map((res:Response) => res.json())
            .map((res) => {
                self.isLoggedIn = res.status;
                if(self.isLoggedIn) {
                    self.userService.setUser(res.data.username, res.data.email, res.data.profilePictureUrl);
                }

                return res;
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    register(email: string, username: string, password: string) {
        let self = this;
        let loginUrl: string = this.authUrl + '/register';

        return self.http.post(loginUrl, {email, username, password})
            .map((res:Response) => res.json())
            .map((res) => {
                self.isLoggedIn = res.status;
                if(self.isLoggedIn) {
                    self.userService.setUser(res.data.username, res.data.email, res.data.profilePictureUrl);
                }
                return self.isLoggedIn;
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    logout() {
        let self = this;
        let logoutUrl: string = this.authUrl + '/logout';

        return self.http.post(logoutUrl, {})
            .map((res:Response) => res.json())
            .map((res) => {
                if(res.status) {
                    self.isLoggedIn = false;
                    self.userService.setUser(null, null ,null);
                }
                
                return res;
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getUserDetails() {
        let self = this;
        let getUserUrl: string = '/api/user/details';

        return self.http.get(getUserUrl)
            .map((res:Response) => res.json())
            .map((res) => {
                if(res.status) {
                    self.isLoggedIn = true;
                    self.userService.setUser(res.data.username, res.data.email, res.data.profilePictureUrl);
                }
                
                return res.status;
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}