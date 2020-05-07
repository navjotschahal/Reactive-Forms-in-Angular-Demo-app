import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numberRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean} | null  => {
        if ((c.value !== null && isNaN(c.value)) || min > c.value || c.value > max) {
            return { rangeError: true};
        }
        return null;
    };
}

export function matchValue(values: string[]): ValidatorFn {
    return (cg: AbstractControl): { [key: string]: boolean} | null  => {
        for (let index = 0; index < values.length - 1; index++) {
            if ( (cg.get(values[index]).value !== cg.get(values[index + 1]).value) && !cg.get(values[index + 1]).pristine ) {
                console.log('oh MIsmatch!!!!');
                return { mismatch: true};
            }
        }
        return null;
        };
}
