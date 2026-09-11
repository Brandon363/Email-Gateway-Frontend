import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UserCreateRequest, UserLoginRequest } from '../../../models/user.interface';
import { AuthService } from '../../../services/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { SharedModules } from '../../shared/shared_modules';
import { AbstractControl, Form, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserRole } from '../../../models/enum.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  imports: [SharedModules],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent implements OnDestroy, OnInit {
  loginSubscription!: Subscription;
  loadingSubscription!: Subscription;
  notificationSubscription!: Subscription;
  // email: string = '';
  loading: boolean = false;
  phoneNumberPattern: RegExp = /^[0-9+]+$/;
  // password: string = '';

  registerForm: FormGroup = new FormGroup({});

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loading = false;

    this.registerForm = new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      other_names: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      // user_role: new FormControl('', [Validators.required]),
      id_number: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      village_of_origin: new FormControl(null, [Validators.required]),
      place_of_birth: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required]),
      confirm_password: new FormControl(null, [Validators.required]),
    }, { validators: this.passwordMatchValidator() });


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

  onSignUp() {
    this.loadingService.setLoadingState(true);
    const loginRequest: UserCreateRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      id_number: this.registerForm.value.id_number,
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name,
      address: this.registerForm.value.address,
      phone_number: this.registerForm.value.phone_number.toString(),
      user_role: UserRole.ADMIN,
      date_of_birth: this.registerForm.value.date_of_birth.toISOString().split('T')[0],
      village_of_origin: this.registerForm.value.village_of_origin,
      place_of_birth: this.registerForm.value.place_of_birth,
      other_names: this.registerForm.value.other_names
    };

    this.loginSubscription = this.authService.register(loginRequest).subscribe((response) => {
      this.loadingService.setLoadingState(false);
      if (!response.success) {
        this.loadingService.setLoadingState(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: response.message || 'Invalid username or password.'
        });
        return;
      }

      this.messageService.add({ severity: 'success', summary: 'Registration Successful', detail: response.message });
      this.router.navigate(['/login']);
    }, (error) => {
      this.loadingService.setLoadingState(false);
      this.messageService.add({ severity: 'error', summary: 'Registration Failed', detail: error.message });
    })
  }


  @HostListener('document:keydown.enter', ['$event'])
  handleGlobalEnter() {
    if (this.registerForm.invalid) {
      return
    }
    else {
      return this.onSignUp()
    }
  }

}
