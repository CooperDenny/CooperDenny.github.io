type Props = { name: string; role: string; location: string };

/** Site footer: copyright year and a one-line identity. */
export default function Footer({ name, role, location }: Props) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <p>
          {role} · {location}
        </p>
      </div>
    </footer>
  );
}
