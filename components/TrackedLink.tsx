'use client';

import { useMemo } from 'react';
import type { MouseEvent, ReactNode } from 'react';

type TrackCategory = 'wallet_download' | 'explorer_outbound';

type TrackedLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  eventKey: string;
  category: TrackCategory;
  sourcePath: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
};

function sendTrackEvent(payload: {
  category: TrackCategory;
  eventKey: string;
  targetUrl: string;
  sourcePath: string;
}) {
  const body = JSON.stringify(payload);

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/track/event', blob);
      return;
    }
  } catch {
    // fallback below
  }

  void fetch('/api/track/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true
  }).catch(() => {
    // ignore tracking network errors
  });
}

export function TrackedLink({
  href,
  className,
  children,
  eventKey,
  category,
  sourcePath,
  target,
  rel
}: TrackedLinkProps) {
  const relValue = useMemo(() => {
    if (!target || target === '_self') {
      return rel;
    }
    const baseRel = rel ? `${rel} ` : '';
    return `${baseRel}noreferrer noopener`.trim();
  }, [rel, target]);

  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    sendTrackEvent({
      category,
      eventKey,
      targetUrl: href,
      sourcePath
    });
  };

  return (
    <a href={href} className={className} target={target} rel={relValue} onClick={handleClick}>
      {children}
    </a>
  );
}
