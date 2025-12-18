import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  // Auth fields
  name = '';
  email = '';
  password = '';

  // Employee fields (NEW)
  employeeId = '';
  gender: 'male' | 'female' | '' = '';
  maritalStatus: 'single' | 'married' | '' = '';

  private router = inject(Router);
  private auth = inject(AuthService);

  submit() {
    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.employeeId ||
      !this.gender ||
      !this.maritalStatus
    ) {
      alert('Please fill all fields');
      return;
    }

    // 1️⃣ Register user (auth)
    this.auth.register(this.name, this.email, this.password);

    // 2️⃣ Build Employee object for Leave Management
    const employee: Employee = {
      employeeId: this.employeeId,
      name: this.name,
      gender: this.gender,
      maritalStatus: this.maritalStatus
    };

    // 3️⃣ Save employee globally
    localStorage.setItem('currentEmployee', JSON.stringify(employee));

    // 4️⃣ Go directly to Leave page
    this.router.navigate(['/home']);
  }
}



// ......................................................................



// import { Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { AuthService } from '../auth/auth.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [FormsModule, RouterLink],
//   templateUrl: './register.html',
//   styleUrls: ['./register.css']
// })
// export class Register {
//   name = '';
//   email = '';
//   password = '';

//   private router = inject(Router);
//   private auth = inject(AuthService);

//   submit() {
//     if (!this.name || !this.email || !this.password) {
//       alert('Please fill all fields');
//       return;
//     }

//     this.auth.register(this.name, this.email, this.password);

//     this.router.navigate(['/home']);
//   }
// }
