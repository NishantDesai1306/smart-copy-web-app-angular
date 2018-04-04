import { Injectable } from '@angular/core';

@Injectable()
export class UtilityService {
    truncateString(str: string, allowedLength: number = 40) {
        if (str && str.length > allowedLength) {
            return str.slice(0, allowedLength) + '...';
        }

        return str;
    }
}