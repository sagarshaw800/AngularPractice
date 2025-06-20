import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DEMO_USERS } from './demo';

export interface User {
  id: string;
  name: string;
  email: string;
  salary: number;
  gender: string;
  dob: Date;
  position: string;
  joiningDate: Date;
  isEditing: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StaticUserService {
  private users: User[] = [...DEMO_USERS];
  private userDetailsSubject = new BehaviorSubject<User[]>(this.users);
  userDetails$ = this.userDetailsSubject.asObservable();

  private highestSalarySubject = new BehaviorSubject<number>(0);
  highestSalary$ = this.highestSalarySubject.asObservable();

  constructor() {
    this.updateHighestSalary(); 
  }

  private updateHighestSalary(): void {
    const maxSalary =
      this.users.length > 0 ? Math.max(...this.users.map((u) => u.salary)) : 0;
      // console.log(maxSalary)
    this.highestSalarySubject.next(maxSalary);
  }

  fetchUsers(): Observable<User[]> {
    return of(this.users);
  }

  updateUser(id: string, updatedUser: Partial<User>): Observable<any> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index > -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      this.userDetailsSubject.next([...this.users]);
    }
    this.updateHighestSalary()
    return of({ success: true });
  }

  deleteUser(id: string): Observable<any> {
    this.users = this.users.filter((user) => user.id !== id);
    this.userDetailsSubject.next([...this.users]);
    this.updateHighestSalary()
    return of({ success: true });
  }
}
