
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './claim-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimForm {

  claimForm: FormGroup;
  submissionState = signal<'idle' | 'success'>('idle');
  totalAmount = signal(0);
  currentStep = signal(1);
  totalSteps = 2;

  constructor(private fb: FormBuilder) {
    this.claimForm = this.fb.group({
      holder: this.fb.group({
        organization: [''],
        hrEmpId: [''],
        employeeName: ['', Validators.required],
        designation: [''],
        officeAddress: [''],
        contactNo: [''],
        patientName: ['', Validators.required],
        patientAge: ['', [Validators.min(0)]],
        cnic: [''],
        relation: [''],
        sex: ['']
      }),

      claim: this.fb.group({
        clinicHospitalDoctor: [''],
        admissionFrom: [''],
        admissionTo: [''],
        surgeonFee: ['', [Validators.min(0)]],
        otCharges: ['', [Validators.min(0)]],
        anesthesia: ['', [Validators.min(0)]],
        consultationFee: ['', [Validators.min(0)]],
        medicineCost: ['', [Validators.min(0)]],
        labTestCost: ['', [Validators.min(0)]],
        otherCharges: ['', [Validators.min(0)]],
        totalCost: ['', [Validators.min(0)]],
        natureOfClaim: ['', Validators.required]
      })
    });
  }

  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(step => step + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep.set(step);
    }
  }

  reset(): void {
    this.claimForm.reset({
        holder: { sex: '' },
        claim: { natureOfClaim: '' }
    });
    this.submissionState.set('idle');
    this.currentStep.set(1);
  }

  onSubmit(): void {

    this.claimForm.markAllAsTouched();
    if (!this.claimForm.valid) {
      return;
    }

    const savedData = {
      ...this.claimForm.value,
      _savedAt: new Date().toISOString()
    };

    const key = 'claimForms';
    try {
      const existingRaw = localStorage.getItem(key);
      let arr: any[] = existingRaw ? JSON.parse(existingRaw) : [];
      if (!Array.isArray(arr)) arr = [];

      arr.unshift(savedData);
      localStorage.setItem(key, JSON.stringify(arr));

      this.submissionState.set('success');

      setTimeout(() => {
        this.reset();
      }, 3000); // Reset form after 3 seconds

    } catch (e) {
      console.error("Failed to save to localStorage", e);
      // Optionally show an error state to the user
    }
  }

  isInvalid(controlName: string, groupName: string): boolean {
    const control = this.claimForm.get(groupName)?.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}




// ......................................................................................


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-claim-form',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './claim-form.html',
//   styleUrls: ['./claim-form.css']
// })
// export class ClaimFormComponent {
//   claimForm!: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.initializeForm();
//   }

//   initializeForm() {
//     this.claimForm = this.fb.group({
//       holder: this.fb.group({
//         organization: [''],
//         hrEmpId: [''],
//         employeeName: ['', Validators.required],
//         designation: [''],
//         officeAddress: [''],
//         contactNo: [''],
//         patientName: ['', Validators.required],
//         patientAge: [''],
//         cnic: [''],
//         relation: [''],
//         sex: ['']
//       }),

//       claim: this.fb.group({
//         clinicHospitalDoctor: [''],
//         admissionFrom: [''],
//         admissionTo: [''],
//         surgeonFee: [''],
//         otCharges: [''],
//         anesthesia: [''],
//         consultationFee: [''],
//         medicineCost: [''],
//         labTestCost: [''],
//         otherCharges: [''],
//         totalCost: [''],
//         natureOfClaim: ['']
//       })
//     });
//   }

//   reset() {
//     this.claimForm.reset();
//   }


//   onSubmit() {
//     if (!this.claimForm.valid) {
//       alert('Form invalid — fill all required fields');
//       return;
//     }

//     const savedData = {
//       ...this.claimForm.value,
//       _savedAt: new Date().toISOString()
//     };


//     const key = 'medicalClaimForms';
//     const existingRaw = localStorage.getItem(key);
//     let arr: any[] = [];

//     try {
//       arr = existingRaw ? JSON.parse(existingRaw) : [];
//       if (!Array.isArray(arr)) arr = [];
//     } catch {
//       arr = [];
//     }

//     arr.unshift(savedData); // newest first
//     localStorage.setItem(key, JSON.stringify(arr));


//     this.reset();

//     alert('Form submitted & saved to LocalStorage!');
//   }
// }
