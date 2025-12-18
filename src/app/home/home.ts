import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// import { MedicalForm } from '../medical-form/medical-form';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private router = inject(Router);
  private auth = inject(AuthService);

  goToMedicalForm() {
    this.router.navigate(['/medical-form']);
  }

  goToClaimForm() {
    this.router.navigate(['/claim-form']);
  }

  goToViewClaim() {
    this.router.navigate(['/view-claim']);
  }

   goToFormArray() {
    this.router.navigate(['/form-array']);
  }

  goToEmpap(){
    this.router.navigate(['/empap'])
  }

  // goToLeaveManagement() {
  //   this.router.navigate(['/lms']);
  // }


  logout() {
    // this.auth.logout();
    this.router.navigate(['/login']);
  }
}
