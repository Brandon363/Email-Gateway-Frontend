import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterUserComponent } from './views/auth/register-user/register-user.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AdminDashboardComponent } from './views/dashboard/admin-dashboard/admin-dashboard.component';
import { EmailRoutesComponent } from './views/email-routes/email-routes.component';
import { InboundLogsComponent } from './views/inbound-logs/inbound-logs.component';
import { AccountSettingsComponent } from './views/account-settings/account-settings.component';
import { UsersComponent } from './views/users/users.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterUserComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'admin-dashboard', pathMatch: 'full' },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'routes', component: EmailRoutesComponent },
      { path: 'logs', component: InboundLogsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'account', component: AccountSettingsComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
