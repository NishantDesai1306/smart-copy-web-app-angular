import { AuthService } from './../../auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';

@Component({
    selector: 'password-field',
    templateUrl: './password.component.html'
})
export class PasswordFieldComponent implements OnInit {

    @Input() inputControl: FormControl;
    @Input() title: string = 'Password';    
    @Input() matchValue: string = null;

    isInitialized: boolean = false;
    
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.inputControl.setValidators([
            Validators.required,
            this.matchesPasswordValidator.bind(this)
        ]);

        this.isInitialized = true;
    }

    ngOnChanges() {
        if (this.isInitialized) {
            const validationErrors = this.matchesPasswordValidator(this.inputControl);
            this.inputControl.setErrors(validationErrors);
        }
    }

    matchesPasswordValidator(control: AbstractControl) {
        if (this.matchValue && control.value !== this.matchValue) {
            return {
                doesNotMatch: true
            }
        }

        return {};
    }
}