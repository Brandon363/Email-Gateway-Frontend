import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CameraCaptureConfig {
  returnUrl: string;
  docLabel?: string;
  maxCaptures?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private capturedFiles: File[] = [];
  private returnUrl: string = '';
  private docLabel: string = 'Document';
  private maxCaptures: number = 10;

  private capturedFilesSubject = new BehaviorSubject<File[]>([]);
  public capturedFiles$: Observable<File[]> = this.capturedFilesSubject.asObservable();

  constructor(private router: Router) {}

  openCamera(returnUrl: string, docLabel: string = 'Document', maxCaptures: number = 10): void {
    this.returnUrl = returnUrl;
    this.docLabel = docLabel;
    this.maxCaptures = maxCaptures;

    sessionStorage.setItem('camera_return_url', returnUrl);
    sessionStorage.setItem('camera_doc_label', docLabel);
    sessionStorage.setItem('camera_max_captures', maxCaptures.toString());

    this.router.navigate(['/capture-camera']);
  }

  setCapturedFiles(files: File[]): void {
    this.capturedFiles = files;
    this.capturedFilesSubject.next(files);
  }

  consumeCapturedFiles(): File[] {
    const files = [...this.capturedFiles];
    this.capturedFiles = [];
    this.capturedFilesSubject.next([]);
    return files;
  }

  getReturnUrl(): string {
    return this.returnUrl || sessionStorage.getItem('camera_return_url') || '/';
  }

  getDocLabel(): string {
    return this.docLabel || sessionStorage.getItem('camera_doc_label') || 'Document';
  }

  getMaxCaptures(): number {
    const stored = sessionStorage.getItem('camera_max_captures');
    return stored ? parseInt(stored, 10) : this.maxCaptures;
  }
}

