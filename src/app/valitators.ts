import { AsyncValidatorFn } from '@angular/forms';
import { map, switchMap, timer } from 'rxjs';
import { UserService } from './state/user.service';

export const uniqueNameValidator: (userService: UserService) => AsyncValidatorFn = (userService) => {
  return (control) => {
    return timer(500).pipe(
      switchMap(() =>
        userService.checkUniqueUserName(control.value.name).pipe(map(({ status }) => (status === 409 ? { userNAmeAlreadyDefined: true } : null)))
      )
    );
  };
};
