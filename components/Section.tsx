import { ReactNode } from 'react';

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section className="container-width mt-12">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-text">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-mute">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
