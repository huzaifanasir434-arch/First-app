
import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
// import { EmployeeDetails } from '../employee-details/employee.details';
import { LeaveManagement } from '../leave-management/leave-management';
import { Employee } from '../../../models/employee.model';

@Component({
  selector: 'app-root',
  templateUrl: './empapp.html',
  // imports: [EmployeeDetails, LeaveManagement],
  imports: [ LeaveManagement],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class App implements OnInit {
  employee = signal<Employee | null>(null);

  ngOnInit(): void {
    const savedEmployee = localStorage.getItem('currentEmployee');
    if (savedEmployee) {
      this.employee.set(JSON.parse(savedEmployee));
    }
  }

  onEmployeeDetailsSaved(details: Employee): void {
    localStorage.setItem('currentEmployee', JSON.stringify(details));
    this.employee.set(details);
  }

  onReset(): void {
    const currentEmployee = this.employee();
    if (currentEmployee) {
      // Also clear their leave data
      localStorage.removeItem(`leaveBalances-${currentEmployee.employeeId}`);
    }
    localStorage.removeItem('currentEmployee');
    this.employee.set(null);
  }
}
