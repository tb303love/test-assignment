import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { uniqueNameValidator } from '../valitators';
import { UserService } from '../state/user.service';

type UserFormGroup = FormGroup<{
  name: FormControl<string>;
  active: FormControl<boolean>;
}>;

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.scss',
})
export class AddUserModalComponent implements OnInit {
  activeModal = inject(NgbActiveModal);
  userForm!: UserFormGroup;
  nameValidator = uniqueNameValidator(inject(UserService));

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        active: this.fb.control(false, { nonNullable: true }),
      },
      { asyncValidators: [this.nameValidator] }
    );
  }

  onSubmitUserForm(): void {
    const { name, active } = this.userForm.controls;
    this.userService.addUser(name.value, active.value).subscribe(() => this.activeModal.close());
  }
}
