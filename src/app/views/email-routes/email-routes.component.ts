import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModules } from '../shared/shared_modules';
import { EmailRouteService } from '../../services/email-route.service';
import { EmailRoute, RouteCreateRequest, RouteUpdateRequest } from '../../models/route.interface';

@Component({
  selector: 'app-email-routes',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './email-routes.component.html',
  styleUrl: './email-routes.component.scss',
  providers: [ConfirmationService]
})
export class EmailRoutesComponent implements OnInit {
  routes: EmailRoute[] = [];
  loading: boolean = false;
  testingRouteId: number | null = null;

  // Dialog State
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  currentRouteId: number | null = null;
  routeForm!: FormGroup;

  // Search filter
  searchQuery: string = '';

  constructor(
    private routeService: EmailRouteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoutes();
  }

  initForm(): void {
    this.routeForm = new FormGroup({
      email_address: new FormControl('', [Validators.required, Validators.email]),
      destination_webhook_url: new FormControl('', [Validators.required]),
      is_active: new FormControl(true)
    });
  }

  loadRoutes(): void {
    this.loading = true;
    this.routeService.getAllRoutes().subscribe({
      next: (data) => {
        this.routes = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Loading Routes',
          detail: err.message || 'Could not fetch routes.'
        });
      }
    });
  }

  get filteredRoutes(): EmailRoute[] {
    if (!this.searchQuery.trim()) {
      return this.routes;
    }
    const q = this.searchQuery.toLowerCase();
    return this.routes.filter(r => 
      r.email_address.toLowerCase().includes(q) || 
      r.destination_webhook_url.toLowerCase().includes(q)
    );
  }

  openCreateDialog(): void {
    this.isEditMode = false;
    this.currentRouteId = null;
    this.routeForm.reset({
      email_address: '',
      destination_webhook_url: '',
      is_active: true
    });
    this.displayDialog = true;
  }

  openEditDialog(route: EmailRoute): void {
    this.isEditMode = true;
    this.currentRouteId = route.id;
    this.routeForm.patchValue({
      email_address: route.email_address,
      destination_webhook_url: route.destination_webhook_url,
      is_active: route.is_active
    });
    this.displayDialog = true;
  }

  saveRoute(): void {
    if (this.routeForm.invalid) {
      return;
    }

    const formVal = this.routeForm.value;

    if (this.isEditMode && this.currentRouteId) {
      const updateReq: RouteUpdateRequest = {
        email_address: formVal.email_address,
        destination_webhook_url: formVal.destination_webhook_url,
        is_active: formVal.is_active
      };

      this.routeService.updateRoute(this.currentRouteId, updateReq).subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Route Updated',
            detail: `Route for ${updated.email_address} has been updated.`
          });
          this.displayDialog = false;
          this.loadRoutes();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err.error?.detail || err.message
          });
        }
      });
    } else {
      const createReq: RouteCreateRequest = {
        email_address: formVal.email_address,
        destination_webhook_url: formVal.destination_webhook_url,
        is_active: formVal.is_active
      };

      this.routeService.createRoute(createReq).subscribe({
        next: (created) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Route Created',
            detail: `Route for ${created.email_address} created successfully.`
          });
          this.displayDialog = false;
          this.loadRoutes();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: err.error?.detail || err.message
          });
        }
      });
    }
  }

  toggleActive(route: EmailRoute, event: any): void {
    const newState = event.checked;
    this.routeService.updateRoute(route.id, { is_active: newState }).subscribe({
      next: (res) => {
        route.is_active = res.is_active;
        this.messageService.add({
          severity: 'info',
          summary: 'Status Changed',
          detail: `Route ${route.email_address} is now ${newState ? 'Active' : 'Inactive'}.`
        });
      },
      error: () => {
        this.loadRoutes();
      }
    });
  }

  testRoute(route: EmailRoute): void {
    this.testingRouteId = route.id;
    this.routeService.testRoute(route.id).subscribe({
      next: (res) => {
        this.testingRouteId = null;
        if (res.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Test Successful',
            detail: res.message
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Test Failed',
            detail: res.message
          });
        }
      },
      error: (err) => {
        this.testingRouteId = null;
        this.messageService.add({
          severity: 'error',
          summary: 'Test Error',
          detail: err.error?.detail || err.message
        });
      }
    });
  }

  confirmDelete(route: EmailRoute): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the route for "${route.email_address}"? Inbound emails to this address will no longer be forwarded.`,
      header: 'Delete Route Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.routeService.deleteRoute(route.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: `Route ${route.email_address} deleted.`
            });
            this.loadRoutes();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: err.error?.detail || err.message
            });
          }
        });
      }
    });
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text);
    this.messageService.add({
      severity: 'info',
      summary: 'Copied',
      detail: `${label} copied to clipboard.`
    });
  }

  exportCSV(): void {
    const dataToExport = this.filteredRoutes;
    if (!dataToExport || dataToExport.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Data',
        detail: 'There are no email routes to export.'
      });
      return;
    }

    const headers = ['ID', 'Email Address', 'Destination Webhook URL', 'Status', 'Created At'];
    const rows = dataToExport.map(r => [
      r.id,
      `"${(r.email_address || '').replace(/"/g, '""')}"`,
      `"${(r.destination_webhook_url || '').replace(/"/g, '""')}"`,
      r.is_active ? 'ACTIVE' : 'INACTIVE',
      r.created_at ? `"${new Date(r.created_at).toISOString()}"` : '""'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const filename = `email-routes_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: `Exported ${dataToExport.length} route(s) to CSV.`
    });
  }
}
