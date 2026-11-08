import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Tumbler } from './SafeLockDial';
import { soundFX } from '../utils/audio';
import { LandingMusic } from './LandingMusic';
import './gateway.css';

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = Array.from({ length: 12 }, (_, i) =>
  new Date(2000, i, 1).toLocaleDateString('en', { month: 'long' }));
const years = Array.from({ length: 22 }, (_, i) => 1996 + i);

export function VerificationGateway({ onVerified }: { onVerified: () => void }) {
  const [day, setDay] = useState(13);
  const [month, setMonth] = useState(9);
  const [year, setYear] = useState(9);
  const [lit, setLit] = useState(false);
  const [error, setError] = useState(false);
  function turn(setIndex: (index: number) => void, index: number) {
    setError(false);
    setIndex(index);
  }
  function unlock() {
    if (days[day] === 22 && month === 6 && years[year] === 2007) {
      soundFX.playUnlockChime();
      onVerified();
    } else {
      soundFX.playErrorWobble();
      setError(true);
    }
  }
  return <section className={lit ? "night-gate lamp-lit" : "night-gate"}>
    <LandingMusic />
    <header className="gate-heading">
      <button type="button" className="diya-switch" aria-pressed={lit}
        aria-label="Light the diya" onClick={() => setLit(value => !value)}>
        <span aria-hidden="true" className="little-lamp"><i /><b /></span>
        <span className="diya-caption">{lit ? 'Your diya is glowing' : 'Tap to light the diya'}</span>
      </button>
      <div className="personal-greeting">Hii Priya</div>
      <h1>I saved a little light <em>for you.</em></h1>
      <p>Turn the dials to the day your light arrived into this world.</p>
    </header>
    <div className="lock-face" onPointerMove={event => {
      if (!lit) return;
      const face = event.currentTarget;
      const bounds = face.getBoundingClientRect();
      face.style.setProperty('--glint-x', (event.clientX - bounds.left) + 'px');
      face.style.setProperty('--glint-y', (event.clientY - bounds.top) + 'px');
    }} onTouchMove={event => {
      if (!lit) return;
      const face = event.currentTarget;
      const bounds = face.getBoundingClientRect();
      face.style.setProperty('--glint-x', (event.touches[0].clientX - bounds.left) + 'px');
      face.style.setProperty('--glint-y', (event.touches[0].clientY - bounds.top) + 'px');
    }}>
      <div aria-hidden="true" className="lock-glint" />
      <div className="lock-rims" aria-hidden="true" />
      <div className="lock-wheels">
        <Tumbler label="Day" items={days} selectedIndex={day} onSelect={i => turn(setDay,i)} formatItem={n => String(n).padStart(2,'0')} />
        <Tumbler label="Month" items={months} selectedIndex={month} onSelect={i => turn(setMonth,i)} />
        <Tumbler label="Year" items={years} selectedIndex={year} onSelect={i => turn(setYear,i)} />
      </div>
    </div>
    {error && <p className="lock-instruction" role="status">Try again with your birthday.</p>}
    <button className="unlock-key" onClick={unlock}><KeyRound size={17} /> Unlock</button>
  </section>;
}
