import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AudioStreamService } from './audio-stream.service';
import { AgentResponse, WhatsappMessage } from '../models/ai-agent.interface';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

@Injectable({
  providedIn: 'root'
})
export class VoiceAgentService {

  private socket$: WebSocketSubject<any> | null = null;
  private chatSocket$: WebSocketSubject<any> | null = null;
  
  // Audio Capture State
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  // Control Flags
  private isCancelled = false;
  private shouldPlayAudio = true; // <--- NEW: Controls if incoming audio should be played

  // Public State
  public state$ = new BehaviorSubject<VoiceState>('idle');
  public transcript$ = new Subject<string>();
  public agentResponse$ = new Subject<AgentResponse>();
  public whatsappMesage$ = new Subject<WhatsappMessage>();

  constructor(private audioPlayer: AudioStreamService) { }

  connect() {
    if (this.socket$ && !this.socket$.closed) return;

    this.socket$ = webSocket({
      url: `${environment.wsUrl}/agent/voice-agent`,
      deserializer: (e) => e.data,
      serializer: (value) => value,
      openObserver: { next: () => console.log('WS Connected') },
      closeObserver: { next: () => console.log('WS Disconnected') }
    });

    this.socket$.subscribe({
      next: async (data: any) => {
        // 1. Audio (Blob)
        if (data instanceof Blob) {
          // CHECK: If user clicked stop, ignore this chunk
          if (!this.shouldPlayAudio) return;

          this.state$.next('speaking');
          const arrayBuffer = await data.arrayBuffer();
          await this.audioPlayer.playChunk(arrayBuffer);
          
          // Only return to idle if we haven't been interrupted
          if (this.shouldPlayAudio) {
             this.state$.next('idle');
          }
        } 
        // 2. Text (JSON)
        else {
          try {
            const msg = JSON.parse(data);
            if (msg.type === 'transcript') this.transcript$.next(msg.text);
            // else if (msg.type === 'agent_text') this.agentResponse$.next(msg.text);
            else if (msg.type === 'agent_response') this.agentResponse$.next(msg.data);
          } catch (e) { console.error("Unknown WS message", data); }
        }
      },
      error: (err) => { 
        console.error('WS Error:', err); 
        this.state$.next('idle'); 
      }
    });
  }


  connectToChatSocket() {
        if (this.chatSocket$ && !this.chatSocket$.closed) return;
    
        this.chatSocket$ = webSocket({
          url: `${environment.wsUrl}/agent/agent-chat-socket`,
          deserializer: (e) => e.data,
          serializer: (value) => value,
          openObserver: { next: () => console.log('WS Connected') },
          closeObserver: { next: () => console.log('WS Disconnected') }
        });
    
        this.chatSocket$.subscribe({
          next: async (data: any) => {
            // 1. Audio (Blob)
            if (data instanceof Blob) {
              // CHECK: If user clicked stop, ignore this chunk
              if (!this.shouldPlayAudio) return;
    
              this.state$.next('speaking');
              const arrayBuffer = await data.arrayBuffer();
              await this.audioPlayer.playChunk(arrayBuffer);
              
              // Only return to idle if we haven't been interrupted
              if (this.shouldPlayAudio) {
                 this.state$.next('idle');
              }
            } 
            // 2. Text (JSON)
            else {
              try {
                const msg = JSON.parse(data);
                console.log(msg)
                if (msg.type === 'transcript') this.transcript$.next(msg.text);
                else if (msg.type === 'whatsapp_message') this.whatsappMesage$.next(msg.data);
              } catch (e) { console.error("Unknown WS message", data); }
            }
          },
          error: (err) => { 
            console.error('WS Error:', err); 
            // this.state$.next('idle'); 
          }
        });
      }



  /**
   * MANUAL START: Call this when user clicks the microphone button.
   */
  async startRecording() {
    this.isCancelled = false;
    this.shouldPlayAudio = true; // <--- RESET: New conversation allows audio again
    
    this.connect();
    this.audioPlayer.initialize(); // Ensure speakers are ready

    try {
      // 1. Get Mic
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = []; // Reset buffer

      // 2. Setup Recorder
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
      
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

      // 3. Collect Data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      };

      // 4. Handle Stop Event (Send logic)
      this.mediaRecorder.onstop = () => {
        if (this.isCancelled) {
            console.log("Recording Cancelled. Discarding audio.");
            this.audioChunks = []; // Dump data
            this.cleanupMic();
            return;
        }
        this.finalizeAndSend();
        this.cleanupMic();
      };

      // 5. Start
      this.mediaRecorder.start();
      this.state$.next('listening');
      console.log("Recording Started (Manual)...");

    } catch (err) {
      console.error('Microphone Access Error:', err);
      this.state$.next('idle');
    }
  }


  cancelRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.isCancelled = true; // <--- SET FLAG
      this.mediaRecorder.stop(); // This triggers onstop, but our flag will block the send
      this.state$.next('idle');
    }
  }

  /**
   * MANUAL STOP: Call this when user clicks the button again.
   */
  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      console.log("Recording Stopped by User.");
      this.state$.next('processing');
      this.mediaRecorder.stop(); // This triggers 'onstop' above
    }
  }

  /**
   * NEW: Stop the agent from speaking immediately.
   */
  stopPlayback() {
    console.log("User stopped audio playback.");
    this.shouldPlayAudio = false; // Block future chunks from this response
    this.audioPlayer.stop(); // Kill current sound
    this.state$.next('idle');
  }

  private finalizeAndSend() {
    if (this.audioChunks.length === 0) return;

    const fullBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    console.log(`Sending Audio: ${(fullBlob.size / 1024).toFixed(2)} KB`);
    
    this.socket$?.next(fullBlob);
    this.audioChunks = [];
  }

  private cleanupMic() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    // Note: We deliberately do NOT stop the AudioPlayer here.
  }
}