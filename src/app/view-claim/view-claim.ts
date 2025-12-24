import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-view-claims',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-claim.html',
  styleUrls: ['./view-claim.css']
})
export class ViewClaim {

  isEditMode = false;
   editIndex: number | null = null;
   
  savedClaims: any[] = [];

  constructor(private router: Router) {  // inject Router
    this.loadClaims();
  }

  loadClaims() {
    const raw = localStorage.getItem('claimForms'); // matches key used by form
    if (!raw) {
      this.savedClaims = [];
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.savedClaims = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error('Failed to parse saved claims', e);
      this.savedClaims = [];
    }
  }

  clearAll() {
    if (!confirm('Delete all saved claims?')) return;
    localStorage.removeItem('claimForms'); // Fix key to 'claimForms'
    this.savedClaims = [];
  }

  deleteClaim(index: number) {
    if (!confirm('Delete this claim?')) return;

    this.savedClaims.splice(index, 1);
    localStorage.setItem('claimForms', JSON.stringify(this.savedClaims));
  }

  editClaim(index: number) {
    const claimToEdit = this.savedClaims[index];
    if (!claimToEdit) return;

    // Store claim to edit in localStorage (or use a shared service for better architecture)
    localStorage.setItem('claimToEdit', JSON.stringify(claimToEdit));

     localStorage.setItem('claimEditIndex', index.toString()); // ⭐ IMPORTANT

    // Navigate to claim form page (adjust route as needed)
    this.router.navigate(['/claim-form']);
  }
}
