'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Icon from '@/components/ui/Icon';
import { chartsLabel, sqlTokens, type SqlToken } from '@/content/selectors';
import type { ChartView } from '@/content/types';
import { runChart, type ChartRunner } from '@/lib/charts/runner';
import { heroPause } from '@/lib/motion/heroPause';
import { prefersReducedMotion } from '@/lib/motion/reducedMotion';

const rowsFormat = new Intl.NumberFormat('en-AU');

/**
 * The hero's chart console: a query types itself, then a live chart fills on a canvas
 * (pitch map, wagon wheel, AFL disposal heatmap; → cycles them). Visitors can click the
 * field to add their own ball, shot or disposal. The data is simulated and labelled as
 * illustrative. Without JavaScript the query shows in full over an empty field.
 */
export default function ChartConsole({ views }: { views: ChartView[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runner = useRef<ChartRunner | null>(null);
  const [current, setCurrent] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [rows, setRows] = useState(0);
  const [last, setLast] = useState('');
  const paused = useSyncExternalStore(heroPause.subscribe, heroPause.get, heroPause.getServer);

  const view = views[current];
  const next = views[(current + 1) % views.length];
  const tokens = useMemo(() => sqlTokens(view.query), [view.query]);
  const typed = useTyping(view.query.length, current);

  useEffect(() => {
    if (!canvasRef.current) return;
    const r = runChart(canvasRef.current, views[0].scene, {
      onEvent: (e) => {
        setRows(e.rows);
        setLast(e.text);
      },
    });
    runner.current = r;
    return () => r.destroy();
  }, [views]);

  useEffect(() => {
    runner.current?.pause(paused);
  }, [paused]);

  function showNext() {
    const n = (current + 1) % views.length;
    setSwapping(true);
    window.setTimeout(
      () => {
        setRows(0);
        setLast('');
        setCurrent(n);
        runner.current?.setScene(views[n].scene);
        setSwapping(false);
      },
      prefersReducedMotion() ? 0 : 220,
    );
  }

  return (
    <figure className="console hero__console" aria-label={chartsLabel(views)}>
      <div className="console__bar">
        <span className="console__file">{view.file}</span>
        <span className="console__pips" aria-hidden="true">
          {views.map((v, i) => (
            <i key={v.scene} aria-current={i === current ? 'true' : undefined} />
          ))}
        </span>
        <button type="button" className="console__next" aria-label={`Next chart: ${next.label}`} onClick={showNext}>
          <span className="console__next-label">{next.label}</span>
          <Icon name="arrowRight" />
        </button>
      </div>
      <pre className="console__query" aria-hidden="true">
        {typedTokens(tokens, typed).map((t, i) => (t.kind ? <span key={i} className={t.kind}>{t.text}</span> : t.text))}
        {typed < view.query.length && <span className="console__caret" />}
      </pre>
      <div className="console__stage">
        <canvas
          ref={canvasRef}
          className={`console__canvas${swapping ? ' is-swapping' : ''}`}
          role="img"
          aria-label={`${view.label}: an animated, illustrative chart`}
        />
      </div>
      <div className="console__status" aria-hidden="true">
        <span className="live" />
        <span>{typed < view.query.length ? 'ready' : 'running'}</span>
        <span>
          <b>{rowsFormat.format(rows)}</b> rows
        </span>
        <span className="console__last">{last}</span>
        <span className="console__hint">{view.hint}</span>
      </div>
    </figure>
  );
}

/** The first `n` characters of a highlighted query. */
function typedTokens(tokens: SqlToken[], n: number): SqlToken[] {
  const out: SqlToken[] = [];
  let left = n;
  for (const t of tokens) {
    if (left <= 0) break;
    out.push(t.text.length <= left ? t : { ...t, text: t.text.slice(0, left) });
    left -= t.text.length;
  }
  return out;
}

/** Characters typed so far: the whole query on the server and under reduced motion, else two every 16ms. */
function useTyping(length: number, key: number) {
  const [typed, setTyped] = useState(length);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setTyped(length);
      return;
    }
    setTyped(0);
    let n = 0;
    let t = window.setTimeout(function step() {
      n += 2;
      setTyped(n);
      if (n < length) t = window.setTimeout(step, 16);
    }, 250);
    return () => window.clearTimeout(t);
  }, [length, key]);
  return typed;
}
