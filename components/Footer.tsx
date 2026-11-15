import { profile } from '@/content/profile';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          {profile.role} · {profile.location}
        </p>
      </div>
    </footer>
  );
}
