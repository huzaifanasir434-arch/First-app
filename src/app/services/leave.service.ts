import { Employee } from './../../models/employee.model';
import { Injectable } from '@angular/core';
import { LeaveBalance, LeaveTypeName } from '../../models/leave.model';

@Injectable({ providedIn: 'root' })
export class LeaveService {

  private readonly ICONS: Record<LeaveTypeName, string> = {
    'Casual': '🌴',
    'Earned': '🏆',
    'Maternity': '👶',
    'Special': '✨',
    'Paternity': '👨‍🍼',
    'Medical': '⚕️',
    'Ex-Pakistan': '✈️',
    'LWP': '💸',
    'Short Leave': '⏱️'
  };

  getInitialLeaveBalances(employee: Employee): LeaveBalance[] {
    const allLeaves: Omit<LeaveBalance, 'applicable' | 'remaining' | 'used'>[] = [
      { type: 'Casual', total: 15, icon: this.ICONS['Casual'], unit: 'days' },
      { type: 'Earned', total: 21, icon: this.ICONS['Earned'], unit: 'days' },
      { type: 'Maternity', total: 120, icon: this.ICONS['Maternity'], unit: 'days' },
      { type: 'Special', total: 180, icon: this.ICONS['Special'], unit: 'days' },
      { type: 'Paternity', total: 30, icon: this.ICONS['Paternity'], unit: 'days' },
      { type: 'Medical', total: 10, icon: this.ICONS['Medical'], unit: 'days' },
      { type: 'Ex-Pakistan', total: 30, icon: this.ICONS['Ex-Pakistan'], unit: 'days' },
      { type: 'Short Leave', total: 9, icon: this.ICONS['Short Leave'], unit: 'hours' },
      { type: 'LWP', total: Infinity, icon: this.ICONS['LWP'], unit: 'days' }
    ];

    return allLeaves.map(leave => {
     const isApplicable = this.isLeaveApplicable(leave.type, employee);
     return {
        ...leave,
        used: 0,
        remaining: isApplicable ? leave.total : 0,
        applicable: isApplicable
     };
    });
  }


  private isLeaveApplicable(leaveType: LeaveTypeName, Employee: Employee): boolean {
    switch (leaveType){
      case 'Maternity' :
        case 'Special' :
          return Employee.gender === 'female' && Employee.maritalStatus === 'married';
        case 'Paternity':
          return Employee.gender === 'male' && Employee.maritalStatus === 'married';
        default:
          return true;
    }
  }

    }


