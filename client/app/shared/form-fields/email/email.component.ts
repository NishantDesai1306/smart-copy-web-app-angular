import { AuthService } from './../../auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'email-field',
    templateUrl: './email.component.html'
})
export class EmailFieldComponent implements OnInit {

    @Input() inputControl: FormControl;
    @Input() title: string = 'Email';    
    @Input() checkForUniqueness: boolean = false;
    
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.inputControl.setValidators([
            Validators.required,
            Validators.email
        ]);

        if (this.checkForUniqueness) {
            this.inputControl.setAsyncValidators(this.validateEmailNotTaken.bind(this));
        }
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
}