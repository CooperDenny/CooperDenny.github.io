type Props = {
  items: string[];
  /** Accessible name for the list, e.g. "Tools used". */
  label?: string;
  size?: 'lg';
};

export default function Chips({ items, label, size }: Props) {
  return (
    <ul className="chips" aria-label={label}>
      {items.map((item) => (
        <li key={item} className={size ? `chip chip--${size}` : 'chip'}>
          {item}
        </li>
      ))}
    </ul>
  );
}
