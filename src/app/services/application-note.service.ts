import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApplicationNoteDTO, ApplicationNoteResponse, ApplicationNoteCreateRequest, ApplicationNoteUpdateRequest } from '../models/application_note.interface';

@Injectable({
  providedIn: 'root'
})
export class ApplicationNoteService {
private baseURL = environment.baseUrl; // or environment.baseUrl depending on your setup
  private subUrl = 'application_notes';
  
  // The central state holder for the notes
  private activeNotes = new BehaviorSubject<ApplicationNoteDTO[]>([]);

  constructor(private httpclient: HttpClient) { }

  /**
   * Standardizes the backend response
   */
  mapToResponse(data: any): ApplicationNoteResponse {
    return {
      success: data.success,
      statusCode: data.status_code,
      message: data.message,
      application_note: data.application_note || null,
      application_notes: data.application_notes || null,
    };
  }

  /**
   * Updates the BehaviorSubject with new data
   */
  updateNotesData(notes: ApplicationNoteDTO[] | ApplicationNoteDTO) {
    if (Array.isArray(notes)) {
      this.activeNotes.next(notes);
    } else {
      const current = this.activeNotes.getValue();
      // Unshift places the new note at the top of the timeline. 
      // If you want it at the bottom, change to current.push(notes)
      current.unshift(notes); 
      this.activeNotes.next(current);
    }
  }

  /**
   * Components will subscribe to this to render the timeline
   */
  retrieveNotesData(): Observable<ApplicationNoteDTO[]> {
    return this.activeNotes.asObservable();
  }

  /**
   * GET all notes for an application and load them into the Subject
   */
  getNotesByApplication(applicationId: number): Observable<ApplicationNoteResponse> {
    return this.httpclient.get(`${this.baseURL}/${this.subUrl}/get-notes/${applicationId}`).pipe(
      map((response: any) => {
        const noteResponse = this.mapToResponse(response);
        if (noteResponse.success) {
          // Update subject (even if empty, it clears out previous application's notes)
          this.updateNotesData(noteResponse.application_notes || []);
        }
        return noteResponse;
      })
    );
  }

  /**
   * POST a new note, then add it to the local Subject immediately
   */
  createNote(createRequest: ApplicationNoteCreateRequest): Observable<ApplicationNoteResponse> {
    return this.httpclient.post(`${this.baseURL}/${this.subUrl}/create-note`, createRequest).pipe(
      map((response: any) => {
        const noteResponse = this.mapToResponse(response);
        if (noteResponse.success && noteResponse.application_note) {
          // Push the newly created note into our active stream
          this.updateNotesData(noteResponse.application_note);
        }
        return noteResponse;
      })
    );
  }

  /**
   * PUT (Edit) an existing note, then update it in the local Subject array
   */
  updateNote(noteId: number, updateRequest: ApplicationNoteUpdateRequest): Observable<ApplicationNoteResponse> {
    return this.httpclient.put(`${this.baseURL}/${this.subUrl}/update-note/${noteId}`, updateRequest).pipe(
      map((response: any) => {
        const noteResponse = this.mapToResponse(response);
        if (noteResponse.success && noteResponse.application_note) {
          const current = this.activeNotes.getValue();
          // Find the edited note and replace it
          const updated = current.map((n: ApplicationNoteDTO) =>
            n.id === noteResponse.application_note?.id ? noteResponse.application_note : n
          );
          this.activeNotes.next(updated);
        }
        return noteResponse;
      })
    );
  }

  /**
   * DELETE a note, then remove it from the local Subject array
   */
  deleteNote(noteId: number): Observable<ApplicationNoteResponse> {
    return this.httpclient.delete(`${this.baseURL}/${this.subUrl}/delete-note/${noteId}`).pipe(
      map((response: any) => {
        const noteResponse = this.mapToResponse(response);
        if (noteResponse.success) {
          const current = this.activeNotes.getValue();
          // Filter out the deleted note using the ID passed into the function
          const updated = current.filter(n => n.id !== noteId);
          this.activeNotes.next(updated);
        }
        return noteResponse;
      })
    );
  }
}