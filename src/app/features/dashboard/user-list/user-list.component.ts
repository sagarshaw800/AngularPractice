import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../../shared/notification.service';

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

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'salary',
    'position',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();
  // users: User[] = [];
  loading = true;
  isEditing = false;
  originalValues: { [id: string]: User } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe((res: any) => {
      const users = res.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        salary: user.salary,
        position: user.position,
        isEditing: user.isEditing,
      }));
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }

  onEdit(user: User) {
    this.originalValues[user.id] = { ...user };
    this.dataSource.data = this.dataSource.data.map((u) =>
      u.id === user.id ? { ...u, isEditing: true } : u
    );
  }

  onSave(user: User) {
    const updatedData: Partial<User> = {
      name: user.name,
      email: user.email,
      salary: user.salary,
      position: user.position,
    };

    this.userService.updateUser(user.id, updatedData).subscribe({
      next: () => {
        user.isEditing = false;
        delete this.originalValues[user.id];
        this.notificationService.showSuccess("User successfully updated 😊")
      },
      error: (err) => {
        this.notificationService.showError("Something went wrong ! 😔")
      },
    });
  }

  onCancel(user: User) {
    const original = this.originalValues[user.id];
    if (original) {
      this.dataSource.data = this.dataSource.data.map((u) =>
        u.id === user.id ? { ...original } : u
      );
      delete this.originalValues[user.id];
      this.notificationService.showSuccess("User data reset successfull!")
    }
  }
}
