import Link from "next/link";

export default function Footer({ footer }) {
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <p className="footer-copy">{footer.copy}</p>
        <div className="footer-links">
          {footer.links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
