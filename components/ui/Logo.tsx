type Props = { src: string; alt: string; width: number; height: number; wide?: boolean };

/** Organisation logo (employers, university), set small beside the entry's title. */
export default function Logo({ src, alt, width, height, wide }: Props) {
  return (
    <div className={wide ? 'logo logo--wide' : 'logo'}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" width={width} height={height} />
    </div>
  );
}
