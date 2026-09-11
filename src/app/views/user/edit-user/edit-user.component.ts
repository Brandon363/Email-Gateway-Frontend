import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserDTO, UserUpdateRequest } from '../../../models/user.interface';
import { LoadingService } from '../../../services/loading.service';
import { SharedModules } from '../../shared/shared_modules';
import { UserService } from '../../../services/user.service';
import { ExtractedUserDTO } from '../../../models/extracted_user.interface';

@Component({
  selector: 'app-edit-user',
  imports: [SharedModules],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnDestroy, OnInit {
  loginSubscription!: Subscription;
  loadingSubscription!: Subscription;
  notificationSubscription!: Subscription;
  getAllSubscription!: Subscription;
  loading: boolean = false;

  phoneNumberPattern: RegExp = /^[0-9+]+$/;

  userId!: number;
  user!: UserDTO;
  extractedUser!: ExtractedUserDTO;


  editUserForm: FormGroup = new FormGroup({});

  constructor(
    private loadingService: LoadingService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.loading = false;
    const resultId = this.route.snapshot.paramMap.get('userId');
    if (resultId) {
      this.userId = parseInt(resultId);
    }


    this.editUserForm = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      other_names: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      id_number: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      village_of_origin: new FormControl(null, [Validators.required]),
      place_of_birth: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required]),
      // confirm_password: new FormControl(null, [Validators.required]),
    }, { validators: this.passwordMatchValidator() });

    this.getResultsById();


    this.loadingSubscription = this.loadingService.isManipulatingData$.subscribe((isLoading) => {
      Promise.resolve(null).then(() => {
        this.loading = isLoading;
      });
    });
  }


  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
    this.notificationSubscription?.unsubscribe();
    this.loginSubscription?.unsubscribe();
    this.getAllSubscription?.unsubscribe();
  }


  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: boolean } | null => {
      if (group instanceof FormGroup) {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirm_password')?.value;

        if (password !== confirmPassword) {
          group.get('confirm_password')?.setErrors({ NoPassswordMatch: true });
          return { NoPassswordMatch: true };
        } else {
          group.get('confirm_password')?.setErrors(null);
          return null;
        }
      }
      return null;
    };
  }

  onEdit() {
    this.loadingService.setLoadingState(true);
    const loginRequest: UserUpdateRequest = {
      email: this.editUserForm.value.email,
      id_number: this.editUserForm.value.id_number,
      first_name: this.editUserForm.value.first_name,
      last_name: this.editUserForm.value.last_name,
      address: this.editUserForm.value.address,
      phone_number: this.editUserForm.value.phone_number.toString(),
      // user_role: UserRole.ADMIN,
      date_of_birth: this.editUserForm.value.date_of_birth.toISOString().split('T')[0],
      village_of_origin: this.editUserForm.value.village_of_origin,
      place_of_birth: this.editUserForm.value.place_of_birth,
      other_names: this.editUserForm.value.other_names,
      id: this.userId
    };

    this.loginSubscription = this.userService.editUser(this.userId, loginRequest).subscribe((response) => {
      this.loadingService.setLoadingState(false);
      if (!response.success) {
        this.loadingService.setLoadingState(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Edit Failed',
          detail: response.message
        });
        return;
      }

      this.messageService.add({ severity: 'success', summary: 'Edit Successful', detail: response.message });
      this.router.navigate(['/account']);
    }, (error) => {
      this.loadingService.setLoadingState(false);
      this.messageService.add({ severity: 'error', summary: 'Edit Failed', detail: error.message });
    })
  }

  getResultsById() {
    if (this.userId) {
      this.loadingService.setLoadingState(true);
      this.getAllSubscription = this.userService.getByUserId(this.userId).subscribe((response) => {
        this.loadingService.setLoadingState(false);
        if (response.success) {
          if (response.user) {
            this.user = response.user;
            if (response.user.extracted_users && response.user.extracted_users.length > 0) {
              this.extractedUser = response.user.extracted_users![response.user.extracted_users!.length - 1];
              console.log(this.extractedUser);
            }

            console.log(this.user);

            this.editUserForm.patchValue({
              first_name: this.user.first_name,
              last_name: this.user.last_name,
              other_names: this.user.other_names,
              email: this.user.email,
              id_number: this.user.id_number,
              date_of_birth: this.user.date_of_birth ? new Date(this.user.date_of_birth) : null,
              village_of_origin: this.user.village_of_origin,
              place_of_birth: this.user.place_of_birth,
              address: this.user.address,
              phone_number: this.user.phone_number,
            });
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      })
    }
  }

  // fieldsMatch(field: string, field2: string): boolean {
  //   return this.editUserForm.get(field)?.value === this.editUserForm.get(field2)?.value;
  // }
  fieldsMatch(value1: any, value2: any): boolean {
    if (value1 === null && value2 === null) {
      return true;
    }
    return value1 === value2;
  }

  getStyle(fieldName: keyof ExtractedUserDTO): any {
    if (!this.extractedUser) {
      return {};
    }
    
    const formValue = this.editUserForm.get(fieldName)?.value;
    const extractedValue = this.extractedUser?.[fieldName];
    
    if (!formValue || !extractedValue) {
      return {};
    }

    return {
      'border': formValue !== extractedValue ? '1px solid red' : '1px solid #ced4da'
    };
  }

  getStyleClass(fieldName: string): string {
  if (!this.extractedUser) {
    return '';
  }
  let formValue = this.editUserForm.get(fieldName)?.value;
  let extractedValue = (this.extractedUser as any)[fieldName];

  if (fieldName === 'date_of_birth') {
    if (formValue && extractedValue) {
      const formDate = new Date(formValue);
      const extractedDate = new Date(extractedValue);
      formValue = formDate.toISOString().split('T')[0];
      extractedValue = extractedDate.toISOString().split('T')[0];
    }
  }

  if (formValue === undefined || extractedValue === undefined) {
    return '';
  }
  return formValue !== extractedValue ? 'border-1 border-round-lg border-red-700' : '';
}

  // matchValidator(field: string, field2: string): ValidatorFn {
  //   return (group: AbstractControl): { [key: string]: boolean } | null => {
  //     if (group instanceof FormGroup) {
  //       const fieldValue = group.get(field)?.value;
  //       const field2Value = group.get(field2)?.value;

  //       if (fieldValue !== field2Value) {
  //         group.get(field2)?.setErrors({ NoMatch: true });
  //         return { NoMatch: true };
  //       } else {
  //         group.get(field2)?.setErrors(null);
  //         return null;
  //       }
  //     }
  //     return null;
  //   };
  // }


  @HostListener('document:keydown.enter', ['$event'])
  handleGlobalEnter() {
    if (this.editUserForm.invalid) {
      return
    }
    else {
      return this.onEdit()
    }
  }

  autoFillExtractedData() {
    if (!this.extractedUser) {
      return;
    }
    this.editUserForm.patchValue({
      first_name: this.extractedUser.first_name,
      last_name: this.extractedUser.last_name,
      other_names: this.extractedUser.other_names,
      id_number: this.extractedUser.id_number,
      date_of_birth: this.extractedUser.date_of_birth ? new Date(this.extractedUser.date_of_birth) : null,
      village_of_origin: this.extractedUser.village_of_origin,
      place_of_birth: this.extractedUser.place_of_birth,
      address: this.extractedUser.address
    });
  }   

}
