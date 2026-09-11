import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioStreamService {
// private audioContext: AudioContext | null = null;
  // private nextStartTime: number = 0;

  // constructor() { }

  // /**
  //  * Initializes or Resumes the AudioContext.
  //  * Browsers require a user gesture (click) to start audio, 
  //  * so call this when the user clicks "Start Voice Mode".
  //  */
  // initialize() {
  //   if (!this.audioContext || this.audioContext.state === 'closed') {
  //     // Create new context if it doesn't exist or was closed
  //     this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  //   } else if (this.audioContext.state === 'suspended') {
  //     // Resume if suspended (common browser policy)
  //     this.audioContext.resume();
  //   }
  // }

  // /**
  //  * Plays a raw PCM Audio Chunk (Float32).
  //  * Robustly handles closed/suspended contexts.
  //  */
  // async playChunk(arrayBuffer: ArrayBuffer) {
  //   // 1. SELF-HEALING: Check if context is dead, and revive it.
  //   if (!this.audioContext || this.audioContext.state === 'closed') {
  //     console.warn("AudioContext was closed. Recreating...");
  //     this.initialize();
  //   }

  //   // 2. Ensure it's running (Chrome/Edge autoplay policy)
  //   if (this.audioContext?.state === 'suspended') {
  //     await this.audioContext.resume();
  //   }

  //   const ctx = this.audioContext!; // We know it exists now

  //   try {
  //     // 3. Convert Raw Bytes to Float32 Audio
  //     // Kokoro TTS sends Float32 at 24,000Hz usually.
  //     const float32Data = new Float32Array(arrayBuffer);

  //     // Create a buffer: 1 Channel (Mono), Length, Sample Rate (24000 matches backend)
  //     const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
  //     audioBuffer.copyToChannel(float32Data, 0);

  //     // 4. Schedule Playback
  //     const source = ctx.createBufferSource();
  //     source.buffer = audioBuffer;
  //     source.connect(ctx.destination);

  //     // Simple Queue Logic: Play immediately or append to end of current audio
  //     const now = ctx.currentTime;
  //     if (this.nextStartTime < now) {
  //       this.nextStartTime = now;
  //     }

  //     source.start(this.nextStartTime);
  //     this.nextStartTime += audioBuffer.duration;

  //   } catch (error) {
  //     console.error("Error playing audio chunk:", error);
  //   }
  // }

  // /**
  //  * Only call this when you truly want to kill audio output (e.g. navigating away).
  //  */
  // stop() {
  //   if (this.audioContext && this.audioContext.state !== 'closed') {
  //     this.audioContext.close();
  //   }
  //   this.audioContext = null;
  //   this.nextStartTime = 0;
  // }

  private audioContext: AudioContext | null = null;
  
  // The magic pointer: Where should the NEXT chunk start playing?
  private nextStartTime: number = 0;

  constructor() {}

  initialize() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } else if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  async playChunk(arrayBuffer: ArrayBuffer) {
    this.initialize(); // Ensure context is alive
    const ctx = this.audioContext!;

    // 1. Decode Raw Float32 Data (24kHz from Kokoro)
    const float32Data = new Float32Array(arrayBuffer);
    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.copyToChannel(float32Data, 0);

    // 2. Prepare Source
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    // 3. GAPLESS PLAYBACK LOGIC
    const currentTime = ctx.currentTime;

    // If the previous chunk finished long ago (gap), reset pointer to 'now'
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }

    // Schedule this chunk to start exactly when the previous one ends
    source.start(this.nextStartTime);

    // Move the pointer forward by the duration of this chunk
    this.nextStartTime += audioBuffer.duration;
  }

  stop() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.nextStartTime = 0;
  }
}
