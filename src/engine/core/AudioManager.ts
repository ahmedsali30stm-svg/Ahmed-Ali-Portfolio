import type { ExperienceEngine } from "./Engine";
import type { AudioChannel, AudioTrack } from "../types";

interface Channel {
  gain: GainNode;
  tracks: Map<string, AudioBufferSourceNode>;
  volume: number;
}

/**
 * Spatial audio system with channel mixing.
 *
 * Channels: music, sfx, ambient, voice.
 * Each channel has independent gain control.
 * Supports crossfade transitions between tracks.
 */
export class AudioManager {
  private engine: ExperienceEngine;
  private ctx: AudioContext | null = null;
  private channels = new Map<AudioChannel, Channel>();
  private trackDefs = new Map<string, AudioTrack>();
  private buffers = new Map<string, AudioBuffer>();
  private _muted = false;
  private _masterVolume = 0.8;

  constructor(engine: ExperienceEngine) {
    this.engine = engine;
  }

  // ─── Init (lazy — requires user gesture) ─────────────────
  private ensureContext() {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    const channelNames: AudioChannel[] = [
      "music",
      "sfx",
      "ambient",
      "voice",
    ];
    for (const name of channelNames) {
      const gain = this.ctx.createGain();
      gain.connect(this.ctx.destination);
      this.channels.set(name, {
        gain,
        tracks: new Map(),
        volume: name === "music" ? 0.6 : name === "sfx" ? 0.8 : 0.5,
      });
    }
  }

  // ─── Track Management ────────────────────────────────────
  registerTrack(track: AudioTrack) {
    this.trackDefs.set(track.id, track);
  }

  registerTracks(tracks: AudioTrack[]) {
    for (const t of tracks) this.registerTrack(t);
  }

  async loadBuffer(trackId: string): Promise<AudioBuffer | null> {
    const def = this.trackDefs.get(trackId);
    if (!def) return null;

    const existing = this.buffers.get(trackId);
    if (existing) return existing;

    this.ensureContext();
    const response = await fetch(def.url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await this.ctx!.decodeAudioData(arrayBuffer);
    this.buffers.set(trackId, buffer);
    return buffer;
  }

  // ─── Playback ────────────────────────────────────────────
  play(trackId: string, fadeIn: number = 1) {
    this.ensureContext();
    const def = this.trackDefs.get(trackId);
    if (!def) return;

    const buffer = this.buffers.get(trackId);
    if (!buffer) return;

    const channel = this.channels.get(def.channel);
    if (!channel) return;

    // Stop existing track on same channel
    this.stop(trackId);

    const source = this.ctx!.createBufferSource();
    source.buffer = buffer;
    source.loop = def.loop ?? false;
    source.connect(channel.gain);

    // Fade in
    channel.gain.gain.setValueAtTime(0, this.ctx!.currentTime);
    channel.gain.gain.linearRampToValueAtTime(
      channel.volume * this._masterVolume,
      this.ctx!.currentTime + fadeIn
    );

    source.start();
    channel.tracks.set(trackId, source);
  }

  stop(trackId: string, fadeOut: number = 0.5) {
    const def = this.trackDefs.get(trackId);
    if (!def) return;

    const channel = this.channels.get(def.channel);
    if (!channel) return;

    const source = channel.tracks.get(trackId);
    if (!source) return;

    // Fade out
    if (this.ctx) {
      channel.gain.gain.linearRampToValueAtTime(
        0,
        this.ctx.currentTime + fadeOut
      );
    }

    setTimeout(() => {
      try {
        source.stop();
      } catch {}
      channel.tracks.delete(trackId);
    }, fadeOut * 1000);
  }

  stopAll(fadeOut: number = 0.5) {
    for (const [, channel] of this.channels) {
      for (const [id] of channel.tracks) {
        this.stop(id, fadeOut);
      }
    }
  }

  // ─── Channel Control ─────────────────────────────────────
  setChannelVolume(channel: AudioChannel, volume: number) {
    const ch = this.channels.get(channel);
    if (!ch) return;
    ch.volume = volume;
    if (this.ctx) {
      ch.gain.gain.setValueAtTime(
        volume * this._masterVolume,
        this.ctx.currentTime
      );
    }
  }

  setMasterVolume(volume: number) {
    this._masterVolume = volume;
    for (const [, channel] of this.channels) {
      if (this.ctx) {
        channel.gain.gain.setValueAtTime(
          channel.volume * volume,
          this.ctx.currentTime
        );
      }
    }
  }

  // ─── Mute ────────────────────────────────────────────────
  mute() {
    this._muted = true;
    for (const [, channel] of this.channels) {
      if (this.ctx) {
        channel.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    }
  }

  unmute() {
    this._muted = false;
    for (const [, channel] of this.channels) {
      if (this.ctx) {
        channel.gain.gain.setValueAtTime(
          channel.volume * this._masterVolume,
          this.ctx.currentTime
        );
      }
    }
  }

  toggleMute() {
    if (this._muted) this.unmute();
    else this.mute();
  }

  get isMuted() {
    return this._muted;
  }

  // ─── Cleanup ─────────────────────────────────────────────
  dispose() {
    this.stopAll(0);
    this.ctx?.close();
    this.ctx = null;
    this.channels.clear();
    this.trackDefs.clear();
    this.buffers.clear();
  }
}
