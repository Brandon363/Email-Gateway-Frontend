import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecorderService {
// private socket$: WebSocketSubject<any>;
//   private myVad: any;

//   constructor() {
//     // Connect to your FastAPI WebSocket endpoint
//     this.socket$ = webSocket('ws://localhost:8000/ws/audio'); 
//   }

//   async startListening() {
//     this.myVad = await vad.MicVAD.new({
//       // "Easy on CPU" magic: only send audio when speech starts
//       onSpeechStart: () => {
//         console.log('User started speaking');
//       },
//       onSpeechEnd: (audio) => {
//         // 'audio' is a Float32Array of the speech segment
//         this.sendAudioToBackend(audio);
//       },
//       // Optional: Stream frames real-time if you want live transcription
//       // onFrameProcessed: (probs) => { ... } 
//     });
//     this.myVad.start();
//   }

//   private sendAudioToBackend(audioData: Float32Array) {
//     // Convert Float32 to something sendable (e.g., base64 or raw bytes)
//     // Faster-Whisper expects raw audio usually
//     this.socket$.next({ type: 'audio_data', payload: audioData });
//   }

//   stop() {
//     this.myVad?.pause();
//   }
}
