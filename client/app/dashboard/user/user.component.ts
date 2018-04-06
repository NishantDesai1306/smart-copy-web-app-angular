import { AuthService } from './../../shared/auth.service';
import {Component, OnInit, NgZone, Inject, EventEmitter, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {NgUploaderOptions, UploadedFile, NgUploaderService} from 'ngx-uploader';

import {UserService} from './../../shared/user.service';
import { NotificationService } from '../../shared/notification.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({templateUrl: './user.component.html'})
export class UserComponent implements OnInit {
    profilePictureUrl: string = '';
    previewData: any;
    error : string = '';
    
    inputUploadEvent: EventEmitter<string>;
    uploaderOptions : NgUploaderOptions;
    uploadProgress: number;
    sizeLimit: number = 5*1024*1024;
    uploadPromise: Promise<string>;

    loading: boolean = false;

    emailControl = new FormControl('', [
        Validators.required,
        Validators.email
    ], this.validateEmailNotTaken.bind(this));
    usernameControl = new FormControl('', [
        Validators.required
    ], this.validateUsernameNotTaken.bind(this));
    
    constructor(
        private userService : UserService, 
        @Inject(NgZone)private zone : NgZone,
        private router : Router,
        private notificationService: NotificationService,
        private authService: AuthService
    ) {
        this.uploadPromise = Promise.resolve("");
        this.inputUploadEvent = new EventEmitter<string>();
    }

    ngOnInit() {
        this
            .userService
            .getUser()
            .subscribe(user => {
                this.usernameControl.setValue(user.getUsername(), {emitEvent: true});
                this.emailControl.setValue(user.getEmail(), {emitEvent: true});
                this.profilePictureUrl = user.getProfilePictureUrl();
            });

        this.uploaderOptions = new NgUploaderOptions({
            url: '/api/upload',
            filterExtensions: true,
            allowedExtensions: ['jpeg', 'jpg', 'png'],
            autoUpload: true,
            maxUploads: 1,
            previewUrl: true,
        });
    }

    validateEmailNotTaken(control: AbstractControl) {
        return this.authService.validateEmail(control.value).map(res => {
            if (!res.data) {
                return {
                    emailAlreadyRegistered: true
                };
            }

            return {};
        });
    }

    validateUsernameNotTaken(control: AbstractControl) {
        return this.authService.validateUsername(control.value).map(res => {
            if (!res.data) {
                return {
                    usernameAlreadyRegistered: true
                };
            }

            return {};
        });
    }

    saveChanges() {        
        this.error = '';
    
        if (this.emailControl.invalid || this.usernameControl.invalid) {
            this.notificationService.createSimpleNotification('User details are invalid or incomplete');
            return;
        }
        
        this.userService
            .changeDetails(this.usernameControl.value, this.emailControl.value)
            .subscribe(res => {
                if (res.status) {
                    this.loading = false;
                    this.router.navigateByUrl('/dashboard');
                    this.notificationService.createSimpleNotification('Changes are saved');
                } else {
                    this.error = res.reason;
                }
            });
    }

    handleUpload(data : any) {
        setTimeout(() => {
            this.zone
                .run(() => {
                    this.uploadProgress = data.progress.percent;
                    console.log(this.uploadProgress)
                    
                    if (data && data.response && !this.loading) {
                        const serverResponse = JSON.parse(data.response);
                        this.uploadProgress = 0;
                    
                        if(serverResponse.status) {
                            this.userService.changeProfilePicture(serverResponse.data).subscribe(()=>{
                                this.notificationService.createSimpleNotification('Profile picture changed');                                
                            });
                        }
                        else {
                            console.error(serverResponse.reason);
                        }
                    }
                });
        });
    }

    beforeUpload(uploadingFile: UploadedFile): void {
        if (uploadingFile.size > this.sizeLimit) {
            uploadingFile.setAbort();
            this.error = 'Can\'t upload file with size more than 5MB';
        }
    }

    handlePreviewData(data: any) {
        this.previewData = data;
    }
}