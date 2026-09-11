import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SharedModules } from '../../shared/shared_modules';
import { EmailRouteService } from '../../../services/email-route.service';
import { RouteStats, WebhookLogItem } from '../../../models/route.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  stats: RouteStats = {
    total_routes: 0,
    active_routes: 0,
    total_inbound_emails: 0,
    successful_forwards: 0,
    failed_forwards: 0
  };

  recentLogs: WebhookLogItem[] = [];
  loading: boolean = false;
  webhookUrl: string = '';

  constructor(
    private router: Router,
    private routeService: EmailRouteService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const host = window.location.hostname;
    this.webhookUrl = `http://${host}:8010/api/v1/webhooks/inbound`;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.routeService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.routeService.getLogs(8).subscribe({
      next: (logs) => {
        this.recentLogs = logs;
      }
    });
  }

  get successRate(): number {
    if (!this.stats.total_inbound_emails || this.stats.total_inbound_emails === 0) {
      return 100;
    }
    return Math.round((this.stats.successful_forwards / this.stats.total_inbound_emails) * 100);
  }

  copyWebhookUrl(): void {
    navigator.clipboard.writeText(this.webhookUrl);
    this.messageService.add({
      severity: 'success',
      summary: 'Copied',
      detail: 'Webhook URL copied to clipboard!'
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
