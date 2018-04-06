import { NotificationService } from './notification.service';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { UserService } from './user.service';

export class CopiedItem {
    static MAX_VALUE_LENGTH = 500;

    displayValue: string = '';

    constructor(
        private _id: string,
        private user: string,
        private value: string,
        private createdAt: Date,
        private isDeleted: boolean
    ) { 
        this.displayValue = this.value && this.value.length > CopiedItem.MAX_VALUE_LENGTH ?
            this.value.slice(0, CopiedItem.MAX_VALUE_LENGTH) + '...' :
            this.value;
    }

    setValue(value): void {
        this.value = value;
    }
    getValue(): string {
        return this.value || null;
    };

    getUser(): string {
        return this.user || null;
    }
    
    getId(): string {
        return this._id || null;
    }
}

@Injectable()
export class CopiedItemService {
    copiedItemsBehaviourSubject: BehaviorSubject<Array<CopiedItem>>;
    apiUrl: string = null;
    copiedItems: CopiedItem[] = null;

    constructor(private http: Http, private userService: UserService, private notificationService: NotificationService) {

        userService.getUser().subscribe((user) => {
            this.apiUrl = `/api/copied-items`;
        });

        this.copiedItemsBehaviourSubject = new BehaviorSubject<Array<CopiedItem>>([]);
    }

    loadItems() {
        return this.http.get(this.apiUrl)
        .map((res:Response) => res.json())
        .map((res) => {
            
            if(res.status) {        
                this.setItems(res.data)
            }

            return res;
        })
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));   
    }

    setItems(items = []) {
        const copiedItems: CopiedItem[] = items.map(({ _id, value, user, createdAt, isDeleted }) => {
            createdAt = new Date(createdAt);
            return new CopiedItem(_id, user,value, createdAt, isDeleted);
        });

        this.copiedItems = copiedItems;
        this.copiedItemsBehaviourSubject.next(this.copiedItems);
    }

    getItems(): Observable<Array<CopiedItem>> {
        if (!this.copiedItems) {
            this.loadItems().subscribe((res) => {
                console.log('loaded data', res);
            });
        }

        return this
            .copiedItemsBehaviourSubject
            .asObservable()
            .share()
            .distinctUntilChanged();
    };

    insertItem(value) {
        const url: string = this.apiUrl + '/insert';

        return this.http.post(url, {
            value
        })
        .map((res:Response) => res.json())
        .map((res) => {
            
            if (res.status) {
                const { _id, user, value, createdAt, isDeleted } = res.data;
                const copiedItem = new CopiedItem(_id, user, value, createdAt, isDeleted);
                this.copiedItems.push(copiedItem);

                this.setItems(this.copiedItems.slice());

                this.notificationService.createSimpleNotification('Item created successfully');
            }

            return res;
        })
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    updateItem(_id, value) {
        const url: string = this.apiUrl + '/update';

        return this.http.post(url, {
            _id,
            value
        })
        .map((res:Response) => res.json())
        .map((res) => {
            
            if(res.status) {
                const { _id, user, value, createdAt, isDeleted } = res.data;
                const copiedItem = this.copiedItems.find(({_id: itemId}) => itemId === _id);

                if (copiedItem) {
                    copiedItem.setValue(value);
                    this.setItems(this.copiedItems.slice());
                }
                else {
                    this.loadItems();
                }

                this.notificationService.createSimpleNotification('Item updated successfully');
            }

            return res;
        })
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    deleteItem(_id) {
        const url: string = this.apiUrl + '/delete';

        return this.http.post(url, {
            _id
        })
        .map((res:Response) => res.json())
        .map((res) => {
            
            if(res.status) {
                const index = this.copiedItems.findIndex(({_id: itemId}) => itemId === _id);

                if (index > -1) {
                    this.copiedItems.splice(index, 1);
                    this.setItems(this.copiedItems.slice());
                }
                else {
                    this.loadItems();
                }

                this.notificationService.createSimpleNotification('Item deleted successfully');
            }

            return res;
        })
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}