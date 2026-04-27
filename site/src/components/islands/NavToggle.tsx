import { useState, useEffect } from 'preact/hooks';

interface NavLink { href: string; label: string }

export default function NavToggle({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        navbar?.classList.toggle('scrolled', window.scrollY > 20);
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <div class="navbar__toggle-wrap">
      <button
        class={`navbar__toggle${open ? ' open' : ''}`}
        aria-expanded={String(open)}
        aria-controls="nav-mobile-panel"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú de navegación'}
        onClick={() => setOpen(o => !o)}
      >
        <span class="navbar__toggle-bar" />
        <span class="navbar__toggle-bar" />
        <span class="navbar__toggle-bar" />
      </button>

      {open && (
        <div class="navbar__mobile-panel" id="nav-mobile-panel" role="navigation" aria-label="Menú móvil">
          <ul role="list">
            {links.map(link => (
              <li key={link.href}>
                <a href={link.href} class="navbar__mobile-link" onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contacto" class="btn-primary navbar__mobile-cta" onClick={close}>
            Trabajemos juntos
          </a>
        </div>
      )}
    </div>
  );
}
