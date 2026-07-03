import { Camera, Gauge, Thermometer, Radio } from 'lucide-react';

import { Container } from './Container';
import { Reveal } from './Reveal';

const DEVICES = [
  { icon: Camera, label: 'Site cameras', note: 'Visual progress capture' },
  { icon: Gauge, label: 'Progress sensors', note: 'Movement and depth' },
  { icon: Thermometer, label: 'Environmental', note: 'Temperature and moisture' },
  { icon: Radio, label: 'Field devices', note: 'LTE-M and NB-IoT' },
];

export function IoTSection() {
  return (
    <section id="iot" className="bg-sunken/40 py-24">
      <Container>
        <Reveal className="max-w-2xl">
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-caption font-semibold uppercase tracking-wide text-accent">
            Coming soon
          </span>
          <h2 className="mt-4 text-h2 font-bold text-ink">The next evolution: sites that report themselves.</h2>
          <p className="mt-4 text-body-lg text-ink-soft">
            Connect sensors, cameras, and field devices on site. Their data feeds the same dashboard,
            so monitoring reaches beyond the drawing to the ground itself.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {DEVICES.map((d) => (
              <div key={d.label} className="rounded-2xl border border-line bg-raised p-6">
                <span className="grid size-11 place-items-center rounded-xl border border-line bg-canvas text-accent">
                  <d.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-body font-semibold text-ink">{d.label}</h3>
                <p className="mt-1 text-small text-ink-muted">{d.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-small text-ink-soft">Any industry, any device, one dashboard.</p>
        </Reveal>
      </Container>
    </section>
  );
}
