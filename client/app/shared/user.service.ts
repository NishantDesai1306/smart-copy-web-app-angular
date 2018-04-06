import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

class User {
    private username: string;
    private email: string;
    private profilePictureUrl: string;
    private social: string = null;

    constructor(username: string, email: string, profilePicture: string, social: string) {
        this.username = username;
        this.email = email;
        this.profilePictureUrl = profilePicture;
        this.social = social;
    }

    getSocial(): string {
        return this.social || null;
    };
    getUsername(): string {
        return this.username || null;
    };
    getEmail(): string {
        return this.email || null;
    }
    getProfilePictureUrl(): string {
        return this.profilePictureUrl || null;
    }
}

@Injectable()
export class UserService {
    userBehaviourSubject: BehaviorSubject<User>;
    apiUrl: string = '/api/user';

    constructor(private http: Http) {
        this.userBehaviourSubject = new BehaviorSubject<User>(new User(null, null, null, null));
    }

    setUser(username, email, profilePicture, social) {
        let user:User = new User(username, email, profilePicture, social);
        this.userBehaviourSubject.next(user);
    }

    getUser(): Observable<User> {
        return this
            .userBehaviourSubject
            .asObservable()
            .share()
            .distinctUntilChanged();
    };

    changeDetails(username, email) {
        let self = this;
        let changeDetailsUrl: string = this.apiUrl + '/change-details';

        return self.http.post(changeDetailsUrl, {username, email})
            .map((res:Response) => res.json())
            .map((res) => {
                if(res.status) {
                    self.setUser(res.data.username, res.data.email, res.data.profilePictureUrl, res.data.socal);
                }
                return res;
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    changeProfilePicture(uploadId) {
        let self = this;
        let changeProfilePictureUrl: string = this.apiUrl + '/change-profile-picture';

        return self.http.post(changeProfilePictureUrl, {profilePicture: uploadId})
            .map((res:Response) => {
                return res.json();
            })
            .map((res) => {
                if(res && res.status) {
                    self.setUser(res.data.username, res.data.email, res.data.profilePictureUrl, res.data.social);
                }
                return res;
            })
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }

    changePassword(oldPassword, newPassword) {
        let self = this;
        let changePasswordUrl: string = this.apiUrl + '/change-password';

        return self.http.post(changePasswordUrl, {oldPassword, newPassword})
            .map((res:Response) => res.json())
            .map((res) => {
                return res;
            })
            .catch((error:any) => Observable.throw(error || 'Server error'));
    }
}