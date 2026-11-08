import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { soundFX } from '../utils/audio';

const ROW = 42;

interface TumblerProps<T> {
  label: string;
  items: T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  formatItem?: (item: T) => string;
}

export function Tumbler<T>({ label, items, selectedIndex, onSelect, formatItem = String }: TumblerProps<T>) {
  const reel = useRef<HTMLDivElement>(null);
  const initial = useRef(selectedIndex);
  const current = useRef(selectedIndex);
  const drag = useRef<{ y: number; top: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const count = items.length;

  useLayoutEffect(() => {
    if (reel.current) reel.current.scrollTop = (count + initial.current) * ROW;
  }, [count]);

  function scrollRows(delta: number) {
    const el = reel.current;
    if (!el) return;
    const target = Math.round(el.scrollTop / ROW) + delta;
    el.scrollTo({ top: target * ROW, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  function readPosition() {
    const el = reel.current!;
    const row = Math.round(el.scrollTop / ROW);
    const index = row % count;
    if (current.current !== index) {
      current.current = index;
      soundFX.playTick();
      onSelect(index);
    }
    if (!drag.current && (row === 0 || row === count * 3 - 1)) {
      el.scrollTop = (count + index) * ROW;
    }
  }

  return <div className="dial-column">
    <span className="dial-label">{label}</span>
    <button type="button" aria-label={'Previous ' + label} onClick={() => scrollRows(-1)}><ChevronUp size={16}/></button>
    <div className={'dial-reel' + (dragging ? ' dragging' : '')} ref={reel}
      role="spinbutton" tabIndex={0} aria-label={label} aria-valuemin={1} aria-valuemax={count}
      aria-valuenow={selectedIndex + 1} aria-valuetext={formatItem(items[selectedIndex])}
      onScroll={readPosition}
      onKeyDown={event => {
        const steps: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, Home: -selectedIndex, End: count - 1 - selectedIndex };
        if (event.key in steps) { event.preventDefault(); scrollRows(steps[event.key]); }
      }}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        drag.current = { y: event.clientY, top: event.currentTarget.scrollTop, moved: false };
      }}
      onPointerMove={event => {
        const start = drag.current;
        if (!start || !event.buttons) return;
        if (Math.abs(start.y - event.clientY) < 3 && !start.moved) return;
        start.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        event.currentTarget.scrollTop = start.top + start.y - event.clientY;
      }}
      onPointerCancel={() => { drag.current = null; setDragging(false); }}
      onPointerUp={() => { if (drag.current?.moved) scrollRows(0); setDragging(false); }}
      onClick={event => {
        const moved = drag.current?.moved;
        drag.current = null;
        if (moved) return;
        const box = event.currentTarget.getBoundingClientRect();
        scrollRows(Math.round((event.clientY - box.top - box.height / 2) / ROW));
      }}>
      {[...items, ...items, ...items].map((item, i) =>
        <div aria-hidden="true" key={i} className={i % count === selectedIndex ? 'dial-value selected' : 'dial-value'}>{formatItem(item)}</div>
      )}
    </div>
    <button type="button" aria-label={'Next ' + label} onClick={() => scrollRows(1)}><ChevronDown size={16}/></button>
  </div>;
}
