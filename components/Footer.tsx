type FooterProps = {
  line1: string;
  line2: string;
  copyright: string;
};

export function Footer({ line1, line2, copyright }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-line/80">
      <div className="container-width flex flex-col gap-2 py-8 text-sm text-mute">
        <p>{line1}</p>
        <p>{line2}</p>
        <p>{copyright}</p>
      </div>
    </footer>
  );
}
