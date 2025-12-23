import { LoginGuard } from './auth/login.guard';
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { Login } from './login/login';
import { Register } from './register/register';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { Home } from './home/home';
import { MedicalForm } from './medical-form/medical-form';
import { ClaimForm } from './claim-form/claim-form';
import { ViewClaim } from './view-claim/view-claim';
import { MedicalArray } from './form-array/form-array';
// import { LeaveManagement } from './components/leave-management/leave-management';
import { App } from './components/empap/empap';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',

  },

  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'home',
        component: Home
      },
      {
        path: 'medical-form',
        component: MedicalForm,
      },
      {
        path: 'claim-form',
        component: ClaimForm,
      },
      {
        path: 'view-claim',
        component: ViewClaim,
      },

      {
        path: 'empap',
        component: App
      },
      // {
      //   path: 'lms',
      //   component: LeaveManagement,
      // },
      {
        path: 'form-array',
        component: MedicalArray,
      },
      {
        path: 'about',
        component: About
      },
      {
        path: 'contact',
        component: Contact
      }
    ]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [LoginGuard] // stop to go on /login
  },
  {
    path: 'register',
    component: Register
  },
];
