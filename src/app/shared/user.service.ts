import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

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
export class UserService {
  private userDetailsSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  userDetails$: Observable<User[]> = this.userDetailsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/Users`).pipe(
      map((response) =>
        response.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          salary: user.salary,
          gender: user.gender,
          dob: new Date(user.dob),
          position: user.position,
          joiningDate: new Date(user.joiningDate),
          isEditing: user.isEditing,
        }))
      )
    );
  }

  updateUser(id: string, updatedUser: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/Users/${id}`, updatedUser);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/Users/${id}`);
  }
}
