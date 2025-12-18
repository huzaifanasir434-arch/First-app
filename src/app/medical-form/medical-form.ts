import { CommonModule } from '@angular/common';
import { Component, Pipe } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { PhoneFormatDirective } from '../../directives/app-unless';
import { NameFormatDirective } from '../../directives/name-format';
import { CustomInput } from '../custom-input/custom-input';
// import { SwapCasePipe } from '../pipes/swap-case-pipe';

@Component({
  selector: 'app-medical-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PhoneFormatDirective, NameFormatDirective, CustomInput],
  templateUrl: './medical-form.html',
  styleUrl: './medical-form.css',
})
export class MedicalForm {

   medicalForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    age: new FormControl('', [Validators.required, Validators.min(0), Validators.max(120)]),
    gender: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.minLength(12),
      Validators.required,
      // Validators.pattern(/^03\d{2}-\d{7}$/),
    ]),

    insuranceProvider: new FormControl('', [Validators.required, Validators.minLength(3)]),
    insuranceNumber: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    // insuranceNumber: new FormControl('', [Validators.required]),
    appointmentDate: new FormControl('', [Validators.required])
})
 onSubmit() {
    if (this.medicalForm.valid) {

      const formData = this.medicalForm.value;

      localStorage.setItem('medicalFormData', JSON.stringify(formData));

       this.medicalForm.reset();

      console.log("Saved Form:", formData);
      alert("Medical form submitted & saved to Local Storage!");
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
}
