
export type LeaveTypeName = 'Casual' | 'Earned' | 'Maternity' | 'Special' | 'Paternity' | 'Medical' | 'Ex-Pakistan' | 'LWP' | 'Short Leave';

export interface LeaveBalance {
  type: LeaveTypeName;
  total: number;
  used: number;
  remaining: number;
  applicable: boolean;
  icon: string;
  unit: 'days' | 'hours';
}
