import './letter.css';
import { useEffect, useRef, useState } from 'react';

const parts = [
  [
    'Hiii Priya,',
    'First of all, Deepawali ki hardik shubhkamnaye tumhe aur tumhare parivar mai sabhi ko. I hope acha raha hoga tumhara ye festive time aur bahut maze kre honge tumne. Mereko ni pta us side kaise Diwali celebrate hoti hai, par jaanne ka bahut mann hai mera. Tumse puchne ka bhi mann tha, par tumne bola tha message mat krna, to maine kra nahi.',
    <>Tumhare sath to udhar kaafi log honge, sabne milke mast patakhe wagerah fodke maze kre honge. Idhar pe is baar akele hi tha mai, to patakhe ni fod paya. Ek reel aai thi feed mai kaafi relatable lagi , mai attach kr dunga usko :{' '}
      <a href="https://www.instagram.com/reel/Dfb25LyM0yz/?mdxt=cGN6ZzEyZmczeGg1" target="_blank" rel="noopener noreferrer" className="text-amber-200 underline underline-offset-4">Instagram reel ↗</a>
      <br />tumse milne ke baad kaafi reels save bhi kri hain maine.</>,
  ],
  [
    'Waise tum soch rahe hoge ki ye website maine banai kyu? Aur kya ye maine hi banai hai? Haaaan, ye maine hi banai hai, tumse apni baat kehne ke lie. Ye bas ek chota sa effort tha mera. Software engineering mai ye sab hi to seekha hai, aaj kaam aa raha hai.',
    'Pichla mahina acha bhi aur bura bhi, dono tha mere lie. Kaafi kuch realize kra maine. Jo bhi ulti chize ho gyi merese, aur meri baaton se tumhe jo bhi bura laga, uske lie I am really really sorry. Aur haan, mere lie ye sirf ek shabd nahi hai, iska matlab kaafi bada hai.',
  ],
  [
    'Mai idhar kuch bhi justify ya clarify ni kruga, na ye boluga ki jaan bujh ke nahi kia. Kyuki mereko pta hai, ek baar hamari wajah se kisi ko bura experience ho jaye, to wo cheez uske mann mai reh jati hai. Fir sirf shabdo se sab theek ni hota.',
    'Us time mai bahut overthinking krra tha aur apne emotions sahi se sambhal ni paya. Us chakkar mai wo baatein bhi likh di jo mai dil se kehna hi ni chahta tha. Par jo bhi tha, likha maine hi tha, aur mereko wo sab nahi kehna chahiye tha.',
    'Us din ke lie sorry yaar. Mai agle din hi ye sab kehna chahta tha, par pichle din jo baatein hui thi, uske baad himmat ni hui wapas text krne ki. Mereko bhi apni kahi hui baaton ka bahut bura laga tha, aur abhi bhi lagta hai. Kaafi kuch aur bhi kehna chahta hu, par fir wahi darr lagra hai ki bolu ya nahi.',
  ],
  [
    'Aur haan, aaj tumhari Facebook story dekhi, acha laga dekh ke. Ek cheez puchni thi usse related, wo paraat mai kya rakha tha? Pooja ke lie tha ya khane ke lie? Mereko samajh ni aaya, to socha puch lu.',
    'Baaki, tumhe jitna time aur space chahiye, tum le sakte ho. Mai apni taraf se text ni kruga us dauraan.',
  ],
  [
    'Pta ni sab kuch sahi se vyakt kr paya ya nahi in shabdo mai. Fir wahi lagta hai ki kaash kabhi IRL mile hote, saamne baithke baat hui hoti. Online mai kabhi kabhi jo kehna chahte hain, wo sahi se pahunch hi ni pata. Par jitna keh paya hu, dil se kaha hai.',
    'Once again, a very Happy Deepawali tumko aur tumhare parivar mai sabhi ko. Khush raho, apna khayal rakhna.',
    'Jai Siya Ram',
  ],
];

export function UnlockedLetterView({ onRelock }: { onRelock: () => void }) {
  const [part, setPart] = useState(0);
  const [lit, setLit] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [part]);
  const titles = ['Diwali ki baatein', 'Ye chota sa effort', 'Us din ke lie', 'Ek choti si baat', 'Dil se'];
  const last = part === parts.length - 1;
  return <article className={'letter-room' + (last && lit ? ' glowing' : '')}>
    <div className="letter-sheet">
      <header className="letter-tools">
        <span>Part {part + 1} / {parts.length}</span>
        <button onClick={onRelock}>Lock note</button>
      </header>
      <nav className="lamp-trail" aria-label="Choose a part of the letter">
        {titles.map((title, index) => <button key={title}
          aria-label={'Part ' + (index + 1) + ': ' + title}
          aria-current={index === part ? 'step' : undefined}
          className={index <= part ? 'warm' : ''} onClick={() => setPart(index)}>
          <span className="earthen-lamp" aria-hidden="true" />
        </button>)}
      </nav>
      <section key={part} className="letter-page" lang="hi-Latn">
        <h1 ref={heading} tabIndex={-1}>{titles[part]}</h1>
        {parts[part].map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </section>
      {last && <div className="wish-lamp">
        <button aria-pressed={lit} onClick={() => setLit(!lit)}>
          <span aria-hidden="true" className="earthen-lamp" />
          {lit ? 'Diya jal gaya' : 'Light the diya'}
        </button>
        {lit && <p role="status">Shubh Deepawali, Priya.</p>}
      </div>}
      <nav className="letter-foot" aria-label="Letter pages">
        <button disabled={part === 0} onClick={() => setPart(part - 1)}>← Back</button>
        <button onClick={() => setPart(last ? 0 : part + 1)}>{last ? 'Read again' : 'Next part'} →</button>
      </nav>
    </div>
  </article>;
}