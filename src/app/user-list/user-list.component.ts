import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { User } from '../app.config';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserQuery } from '../state/user.query';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private modalService = inject(NgbModal);
  private userQuery = inject(UserQuery);

  users = toSignal<User[], User[]>(this.userQuery.selectUsers$, { initialValue: [] });
  isAddNewButtonEnabled = computed(() => {
    const users = this.users();
    const everyActive = users.every(({ active }) => active);
    return everyActive && users.length < 5;
  });

  openAddNewUserModal(): void {
    this.modalService.open(AddUserModalComponent);
  }
}
