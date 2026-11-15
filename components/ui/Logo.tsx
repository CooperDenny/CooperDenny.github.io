type Props = { src: string; alt: string; width: number; height: number; wide?: boolean };

/** Organisation logo on a white tile (employers, university). */
export default function Logo({ src, alt, width, height, wide }: Props) {
  return (
    <div className={wide ? 'job__logo job__logo--wide' : 'job__logo'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" width={width} height={height} />
    </div>
  );
}
