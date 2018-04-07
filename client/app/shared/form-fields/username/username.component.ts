import { AuthService } from './../../auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'username-field',
    templateUrl: './username.component.html'
})
export class UsernameFieldComponent implements OnInit {

    @Input() inputControl: FormControl;
    @Input() title: string = 'Username';
    @Input() checkForUniqueness: boolean = false;
    
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.inputControl.setValidators(Validators.required);

        if (this.checkForUniqueness) {
            this.inputControl.setAsyncValidators(this.validateUsernameNotTaken.bind(this));
        }
    }

    validateUsernameNotTaken(control: AbstractControl) {
        return this.authService.validateUsername(control.value)
            .map(res => {
                if (!res.data) {
                    return {
                        usernameAlreadyRegistered: true
                    };
                }

                return {};
            });
    }
}