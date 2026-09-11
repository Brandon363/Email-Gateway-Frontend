import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { UserDTO } from '../../../models/user.interface';
import { VerificationTrackingService } from '../../../services/verification-tracking.service';
import { Subscription } from 'rxjs';
import { SharedModules } from '../../shared/shared_modules';
import { VerificationTrackingDTO } from '../../../models/verification_tracking.interface';
import { UserService } from '../../../services/user.service';
import { UserRole } from '../../../models/enum.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verification-tracking',
  imports: [SharedModules],
  templateUrl: './verification-tracking.component.html',
  styleUrl: './verification-tracking.component.scss'
})
export class VerificationTrackingComponent implements OnInit, OnDestroy {
  @Input() user!: UserDTO;

  loggedInUser!: UserDTO;

  verificationTrackings: VerificationTrackingDTO[] = [];
  getAllSubscription!: Subscription;
  getAllUsersSubscription!: Subscription;
  retrieveSubscription!: Subscription;
  users: UserDTO[] = [];



  constructor(
    private verificationTrackingService: VerificationTrackingService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnDestroy(): void {
    this.getAllSubscription?.unsubscribe();
    this.retrieveSubscription?.unsubscribe()
    this.getAllUsersSubscription?.unsubscribe()
  }

  events: any[] = [];


  ngOnInit(): void {
    this.loggedInUser = this.authService.getCurrentUser();
    this.getAllSubscription = this.verificationTrackingService.getAllActiveUserVerificationTrackings(this.user.id).subscribe()
    this.retrieveSubscription = this.verificationTrackingService.retrieveVerificationTrackingData().subscribe((response) => {
      this.verificationTrackings = response;
    })

    if (this.loggedInUser.user_role == UserRole.ADMIN) {
      this.getAllUsersSubscription = this.userService.getAllActiveUsers().subscribe((response) => {
        this.users = response.users!;
      })
    }

  }

  getUserFromId(id: number): string {
    if (!this.users) {
      return '';
    }
    if (!id || id === null || id === undefined) {
      return '';
    }

    else {
      const u = this.users.find(user => user.id === id) as UserDTO;
      if (!u) {
        return '';
      }
      return u.first_name + ' ' + u.last_name;
    }

  }
}
