
import { Component, ChangeDetectionStrategy, input, output, computed, signal, effect, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '../../../models/employee.model';
import { LeaveBalance} from '../../../models/leave.model';
import { LeaveService } from '../../services/leave.service';
@Component({
  selector: 'app-leave-management',
  imports: [ReactiveFormsModule],
  templateUrl: './leave-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveManagement implements OnInit {
  employee = input.required<Employee>();
  reset = output<void>();

  leaveBalances = signal<LeaveBalance[]>([]);
  notification = signal<{ type: 'success' | 'error', message: string } | null>(null);

  private readonly leaveService = inject(LeaveService);
  private readonly fb = inject(FormBuilder);

  leaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    duration: [1, [Validators.required, Validators.min(1)]]
  });

  applicableLeaveTypes = computed(() => this.leaveBalances().filter(lb => lb.applicable && lb.total !== Infinity));
  selectedLeaveBalance = computed(() => {
    const selectedType = this.leaveForm.value.leaveType;
    return this.leaveBalances().find(lb => lb.type === selectedType) ?? null;
  });
  selectedLeaveUnit = computed(() => this.selectedLeaveBalance()?.unit ?? 'days');
Infinity: any;

  constructor() {
    effect(() => {
        const balance = this.selectedLeaveBalance();
        const durationControl = this.leaveForm.get('duration');
        if (balance && durationControl) {
            if (balance.type === 'Short Leave') {
              const maxHours = Math.min(balance.remaining, 3);
              durationControl.setValidators([Validators.required, Validators.min(1), Validators.max(maxHours)]);
            } else {
              durationControl.setValidators([Validators.required, Validators.min(1), Validators.max(balance.remaining)]);
            }
            durationControl.setValue(1, { emitEvent: false });
            durationControl.updateValueAndValidity({ emitEvent: false });
        }
    });
  }

  ngOnInit(): void {
    const storageKey = `leaveBalances-${this.employee().employeeId}`;
    const savedBalances = localStorage.getItem(storageKey);

    if (savedBalances) {
      this.leaveBalances.set(JSON.parse(savedBalances));
    } else {
      const initialBalances = this.leaveService.getInitialLeaveBalances(this.employee());
      this.leaveBalances.set(initialBalances);
      localStorage.setItem(storageKey, JSON.stringify(initialBalances));
    }
  }

  applyForLeave(): void {
    if (this.leaveForm.invalid) {
      this.showNotification('error', 'Please fill the form correctly.');
      return;
    }

    const { leaveType, duration } = this.leaveForm.value;
    if (!leaveType || !duration) return;

    this.leaveBalances.update(balances => {
      return balances.map(balance => {
        if (balance.type === leaveType) {
          return {
            ...balance,
            used: balance.used + duration,
            remaining: balance.remaining - duration,
          };
        }
        return balance;
      });
    });

    const storageKey = `leaveBalances-${this.employee().employeeId}`;
    localStorage.setItem(storageKey, JSON.stringify(this.leaveBalances()));

    const unit = this.selectedLeaveBalance()?.unit === 'hours' ? 'hour(s)' : 'day(s)';
    this.showNotification('success', `Successfully applied for ${duration} ${unit} of ${leaveType} leave.`);
    this.leaveForm.reset({ leaveType: '', duration: 1 });
  }

  showNotification(type: 'success' | 'error', message: string): void {
    this.notification.set({ type, message });
    setTimeout(() => this.notification.set(null), 3000);
  }

  onReset(): void {
    this.reset.emit();
  }
}
