import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';


@Component({
  selector: 'app-custom-input',
  template: `
    <input [value]="value"
    (input)="onInput($event)"
    (blur)="onTouched()"
    />
    `,

  standalone: true,
  styles: [`
    input {
       border: 1px solid #000; /* black border as requested */
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    outline: none;
    transition: box-shadow .12s ease, border-color .12s ease;
    }
  `],

  imports: [],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true,
    },
  ],
})

export class CustomInput implements ControlValueAccessor {

  value: string = '';

  // These will be assigned by Angular
  onChange = (value: any) => {};
  onTouched = () => {};

  // When Angular sets the value from the form
  writeValue(value: any) {
    this.value = value;
  }

  // When Angular registers a change function
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  // When Angular registers a touched function
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // // When user types in the input (allows all characters)
  // onInput(event: any) {
  //   this.value = event.target.value;

  //   // Notify Angular form about the change
  //   this.onChange(this.value);

   /** ⛔ BLOCK NON-NUMBERS → ✓ ALLOW ONLY DIGITS */
  onInput(event: any) {
    let inputValue = event.target.value;

    // Remove everything that is NOT a number
    inputValue = inputValue.replace(/[^0-9]/g, '');

    this.value = inputValue;
    event.target.value = inputValue;

    this.onChange(this.value);  // update Angular form

  }
}
