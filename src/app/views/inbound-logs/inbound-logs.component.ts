import { Component, OnInit } from '@angular/core';
import { SharedModules } from '../shared/shared_modules';
import { EmailRouteService } from '../../services/email-route.service';
import { WebhookLogItem } from '../../models/route.interface';

@Component({
  selector: 'app-inbound-logs',
  standalone: true,
  imports: [SharedModules],
  templateUrl: './inbound-logs.component.html',
  styleUrl: './inbound-logs.component.scss'
})
export class InboundLogsComponent implements OnInit {
  logs: WebhookLogItem[] = [];
  loading: boolean = false;
  searchQuery: string = '';

  selectedLog: WebhookLogItem | null = null;
  displayDetailDialog: boolean = false;

  constructor(private routeService: EmailRouteService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.loading = true;
    this.routeService.getLogs(100).subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get filteredLogs(): WebhookLogItem[] {
    if (!this.searchQuery.trim()) {
      return this.logs;
    }
    const q = this.searchQuery.toLowerCase();
    return this.logs.filter(l =>
      (l.from_address && l.from_address.toLowerCase().includes(q)) ||
      (l.to_addresses && l.to_addresses.toLowerCase().includes(q)) ||
      (l.subject && l.subject.toLowerCase().includes(q)) ||
      (l.status && l.status.toLowerCase().includes(q)) ||
      (l.destination_url && l.destination_url.toLowerCase().includes(q))
    );
  }

  openDetails(log: WebhookLogItem): void {
    this.selectedLog = log;
    this.displayDetailDialog = true;
  }

  exportCSV(): void {
    const dataToExport = this.filteredLogs;
    if (!dataToExport || dataToExport.length === 0) {
      return;
    }

    const headers = ['ID', 'Timestamp', 'From', 'To', 'Subject', 'Destination URL', 'Status', 'Status Message'];
    const rows = dataToExport.map(l => [
      l.id,
      l.created_at ? `"${new Date(l.created_at).toISOString()}"` : '""',
      `"${(l.from_address || '').replace(/"/g, '""')}"`,
      `"${(l.to_addresses || '').replace(/"/g, '""')}"`,
      `"${(l.subject || '').replace(/"/g, '""')}"`,
      `"${(l.destination_url || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`,
      `"${(l.status_message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const filename = `inbound-logs_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
