
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
  filePreviews: FilePreview[] = [];
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
    attachments: this.fb.control<any[]>([]),
    natureOfClaim: ['', Validators.required]
  })

});
//update for view claim
// Load claimToEdit from localStorage
  const editRaw = localStorage.getItem('claimToEdit');
  if (editRaw) {
    try {
      const editClaim = JSON.parse(editRaw);

      // Patch form values - adjust as necessary if structure matches formGroup
      this.claimForm.patchValue(editClaim);

      // For attachments, you might need special handling:
      if (editClaim.claim?.attachments) {
        // attachments are File[], but you might have stored only metadata
        // Here, you have to decide how to handle attachments (e.g., no files on reload)
        // Maybe clear attachments or show placeholders

        this.claimForm.get('claim.attachments')?.setValue(editClaim.claim.attachments);
      }
    } catch (e) {
      console.error('Failed to load claimToEdit', e);
    }

    // Remove after loading to prevent loading again accidentally
    localStorage.removeItem('claimToEdit');
  }

// Total amount automatically

this.claimForm.get('claim')!.valueChanges.subscribe(values => {
  const total =
    (values.surgeonFee || 0) +
    (values.otCharges || 0) +
    (values.anesthesia || 0) +
    (values.consultationFee || 0) +
    (values.medicineCost || 0) +
    (values.labTestCost || 0) +
    (values.otherCharges || 0);

  this.totalAmount.set(total);
  this.claimForm.get('claim.totalCost')?.setValue(total, { emitEvent: false });
});

   // Auto-fill from Logged-in Employee
const empRaw = localStorage.getItem('reguser');
if (empRaw) {
  const emp = JSON.parse(empRaw);
  this.claimForm.patchValue({
    holder: {
      employeeName: emp.name,
      hrEmpId: emp.employeeId
    }
  });
}
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

// new file preview UPDATE DELETE VIEW

onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const newFiles = Array.from(input.files);

  // merge with existing files
  const existingFiles =
    (this.claimForm.get('claim.attachments')?.value as File[]) || [];

  const mergedFiles = [...existingFiles, ...newFiles];
  this.claimForm.get('claim.attachments')?.setValue(mergedFiles);

const newPreviews: FilePreview[] = newFiles.map(file => ({
  file,
  url: URL.createObjectURL(file),
  type: file.type.startsWith('image/')
    ? 'image'
    : 'pdf'
}));



  // immutable update (OnPush)
  this.filePreviews = [...this.filePreviews, ...newPreviews];

  // reset input so same file can be re-selected
  input.value = '';
}

openFile(item: FilePreview) {
  window.open(item.url, '_blank');
}

removeFile(index: number) {
  const files =
    this.claimForm.get('claim.attachments')?.value as File[];

  const updatedFiles = files.filter((_, i) => i !== index);
  this.claimForm.get('claim.attachments')?.setValue(updatedFiles);

  URL.revokeObjectURL(this.filePreviews[index].url);

  this.filePreviews = this.filePreviews.filter((_, i) => i !== index);
}



// file preview only
// imagePreviews: string[] = [];

// onFilesSelected(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (!input.files) return;

//   const files = Array.from(input.files);
//   this.claimForm.get('claim.attachments')?.setValue(files);

//   const previews: string[] = [];

//   files.forEach(file => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       previews.push(reader.result as string);

//       // 🔥 IMPORTANT: create new reference
//       this.imagePreviews = [...previews];
//     };
//     reader.readAsDataURL(file);
//     console.log('Files:', this.claimForm.get('claim.attachments')?.value);
// console.log('Previews:', this.imagePreviews);
//   });
// }

// removeFile(index: number) {
//   const files = this.claimForm.get('claim.attachments')?.value as File[];

//   const updatedFiles = files.filter((_, i) => i !== index);
//   this.claimForm.get('claim.attachments')?.setValue(updatedFiles);

//   this.imagePreviews = this.imagePreviews.filter((_, i) => i !== index);
// }


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

    console.log(
  'Before save:',
  this.claimForm.get('claim.attachments')?.value
);


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
