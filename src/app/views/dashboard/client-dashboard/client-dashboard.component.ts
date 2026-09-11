import { Component } from '@angular/core';
import { SharedModules } from '../../shared/shared_modules';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

@Component({
  selector: 'app-client-dashboard',
  imports: [SharedModules, AdminDashboardComponent],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent {}
