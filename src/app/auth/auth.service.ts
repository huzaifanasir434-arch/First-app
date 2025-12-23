import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject keeps current login state for components to subscribe to
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));
  public isLoggedIn$ = this.loggedIn.asObservable();

   login(email: string, password: string) {
    const fakeToken = btoa(email + ':' + Date.now());
    const user = { email };

    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify(user));

    this.loggedIn.next(true);
  }

  // ----- TOKEN CHECK -----
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Simple fake login: save user to localStorage no token

  // login(email: string, password: string) {
  //   // In real app: call backend -> get token -> store token
  //   const user = { email };
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.loggedIn.next(true);
  // }

  // Simple fake register: save and mark logged in
  register(name: string, email: string, password: string) {
    const user = { name, email};
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }

  // synchronous check (useful in guards)
  // isAuthenticated(): boolean {
  //   return !!localStorage.getItem('user');
  // }

  // optional helper to read current user
  getUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  getuserEmail(): string | null {
    const raw = localStorage.getItem('user');
  if (!raw) return null;
  return JSON.parse(raw)?.email || null;
}
}
