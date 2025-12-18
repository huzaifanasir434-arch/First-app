
import { Component, ChangeDetectionStrategy, output, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-employee-details',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetails {

  detailsSaved = output<Employee>();

  private readonly fb = inject(FormBuilder);

  employeeForm = this.fb.group({
    employeeId: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    gender: ['', Validators.required],
    maritalStatus: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.detailsSaved.emit(this.employeeForm.getRawValue() as Employee);
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }
}
