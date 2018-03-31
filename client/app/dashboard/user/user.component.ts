import {Component, OnInit, NgZone, Inject, EventEmitter, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {NgUploaderOptions, UploadedFile, NgUploaderService} from 'ngx-uploader';

import {UserService} from './../../shared/user.service';
import { NotificationService } from '../../shared/notification.service';

@Component({templateUrl: './user.component.html'})
export class UserComponent implements OnInit {

    user : any;
    previewData: any;
    error : string = '';
    
    inputUploadEvent: EventEmitter<string>;
    uploaderOptions : NgUploaderOptions;
    uploadProgress: number;
    sizeLimit: number = 5*1024*1024;
    uploadPromise: Promise<string>;

    loading: boolean = false;

    constructor(
        private userService : UserService, 
        @Inject(NgZone)private zone : NgZone,
        private router : Router,
        private notificationService: NotificationService
    ) {
        this.uploadPromise = Promise.resolve("");
        this.inputUploadEvent = new EventEmitter<string>();
    }

    saveChanges() {
        const self = this;
        
        self.error = '';
    
        if (!self.user.username) {
            return self.error = 'Username can`t be empty';
        }
        if (!self.user.email) {
            return self.error = 'Email can`t be empty';
        }
        
        self.userService
            .changeDetails(self.user.username, self.user.email)
            .subscribe(res => {
                if (res.status) {
                    self.loading = false;
                    self.router.navigateByUrl('/dashboard');
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

    ngOnInit() {
        const self = this;
        self
            .userService
            .getUser()
            .subscribe(user => {
                self.user = Object.assign({}, user);
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
}