import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface User {
  id: string;
  name: string;
  email: string;
  salary: number;
  gender: string;
  dob: Date;
  position: string;
  joiningDate: Date;
}

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'salary', 'position', 'actions'];
  dataSource = new MatTableDataSource<any>();
  users: User[] = [];
  loading = true;
  isEditing = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.fetchUsers().subscribe((res: any) => {
      const users = res.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        salary: user.salary,
        position: user.position,
      }));
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
    });
  }
}
