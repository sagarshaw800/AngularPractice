import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StaticUserService, User } from '../../../shared/static-user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../../shared/notification.service';

@Component({
  selector: 'app-static-user-list',
  standalone: false,
  templateUrl: './static-user-list.component.html',
  styleUrls: ['./static-user-list.component.css'],
})
export class StaticUserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'salary',
    'position',
    'actions',
  ];
  dataSource = new MatTableDataSource<User>();
  loading = true;
  originalValues: { [id: string]: User } = {};
  highestSalary: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private staticUserService: StaticUserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.staticUserService.userDetails$.subscribe((users: User[]) => {
      this.dataSource.data = users.map((user) => ({
        ...user,
        isEditing: false,
      }));
      this.loading = false;
    });
    this.staticUserService.highestSalary$.subscribe((salary) => {
      this.highestSalary = salary;
      // console.log(salary);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onEdit(user: User) {
    this.originalValues[user.id] = { ...user };
    user.isEditing = true;
  }

  onSave(user: User) {
    user.isEditing = false;
    const { id, ...updatedFields } = user;
    delete this.originalValues[user.id];

    this.staticUserService.updateUser(id, updatedFields).subscribe(() => {
      this.notificationService.showSuccess('Static user updated locally 😊');
    });
  }

  onCancel(user: User) {
    const original = this.originalValues[user.id];
    if (original) {
      Object.assign(user, original);
      delete this.originalValues[user.id];
      this.notificationService.showSuccess('Static user changes reverted!');
    }
  }

  onDelete(user: User) {
  this.staticUserService.deleteUser(user.id).subscribe(() => {
    this.notificationService.showSuccess('Static user deleted 🗑️');
  });
}
}
