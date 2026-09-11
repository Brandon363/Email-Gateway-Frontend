import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OvertimeStatusEvent {
  event: string;
  stage: 'uploading' | 'extracting' | 'validating' | 'complete' | 'error' | 'idle';
  message: string;
  overtime_id?: number;
  total_rows?: number;
  flagged?: number;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class OvertimeWebsocketService implements OnDestroy {
  private ws: WebSocket | null = null;
  private wsUrl = environment.wsUrl;

  private statusSubject = new BehaviorSubject<OvertimeStatusEvent>({
    event: '',
    stage: 'idle',
    message: '',
  });

  public status$ = this.statusSubject.asObservable();

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
      this.ws = null;
    }

    this.ws = new WebSocket(`${this.wsUrl}/overtime/ws/overtime-status`);

    this.ws.onopen = () => {
      console.log('[OvertimeWS] Connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data: OvertimeStatusEvent = JSON.parse(event.data);
        this.statusSubject.next(data);
      } catch (e) {
        console.warn('[OvertimeWS] Could not parse message:', event.data);
      }
    };

    this.ws.onerror = (error) => {
      console.error('[OvertimeWS] Error:', error);
    };

    this.ws.onclose = () => {
      console.log('[OvertimeWS] Disconnected');
      this.statusSubject.next({ event: '', stage: 'idle', message: '' });
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  clearStatus(): void {
    this.statusSubject.next({ event: '', stage: 'idle', message: '' });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
