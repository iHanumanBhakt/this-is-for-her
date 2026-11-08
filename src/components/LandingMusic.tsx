import { useEffect, useRef, useState } from 'react';
import { Music2, Pause } from 'lucide-react';

// A quiet, original pentatonic phrase with room between the notes.
const melody = [62, 69, 74, 76, 74, 69, 67, 64, 62, 67, 69, 74, 71, 69, 64, 67];

export function LandingMusic() {
  const audio = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!playing || !audio.current) return;
    const ctx = audio.current;
    let beat = 0;
    let next = ctx.currentTime + 0.1;
    function tone(note: number, start: number, duration: number, volume: number) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }
    function schedule() {
      next = Math.max(next, ctx.currentTime);
      while (next < ctx.currentTime + 0.45) {
        tone(melody[beat % melody.length], next, 2.5, 0.055);
        if (beat % 4 === 0) tone(beat % 8 === 0 ? 50 : 43, next, 4, 0.034);
        beat++;
        next += beat % 4 === 0 ? 1.65 : 1.05;
      }
    }
    schedule();
    const timer = window.setInterval(schedule, 200);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => () => { void audio.current?.close(); audio.current = null; }, []);

  async function toggle() {
    if (audio.current) {
      const ctx = audio.current;
      audio.current = null;
      setPlaying(false);
      await ctx.close();
      return;
    }
    try {
      const ctx = new AudioContext();
      audio.current = ctx;
      await ctx.resume();
      if (audio.current === ctx) setPlaying(true);
      setFailed(false);
    } catch {
      void audio.current?.close();
      audio.current = null;
      setFailed(true);
    }
  }
  return <button type="button" className="landing-music" onClick={toggle} aria-pressed={playing}>
    {playing ? <Pause size={14} /> : <Music2 size={14} />}
    {playing ? 'Pause music' : failed ? 'Retry music' : 'Play music'}
  </button>;
}
