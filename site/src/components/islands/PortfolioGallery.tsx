import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: string;
  size: 'normal' | 'tall' | 'wide' | 'large';
}

interface Category {
  id: string;
  label: string;
}

interface Props {
  photos: GalleryPhoto[];
  categories: Category[];
}

const BATCH = 16;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div class="portfolio__skeleton" aria-hidden="true">
      <div class="portfolio__skeleton-shine" />
      <div class="portfolio__skeleton-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── PhotoItem ────────────────────────────────────────────────────────────────

function PhotoItem({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div
      class={`portfolio__item portfolio__item--${photo.size}`}
      style={`animation-delay:${index * 0.035}s`}
      onClick={onOpen}
    >
      <div class="portfolio__item-inner">
        {!loaded && <Skeleton />}
        <img
          ref={imgRef}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          class={loaded ? 'blur-img loaded' : 'blur-img'}
          onLoad={() => setLoaded(true)}
        />
        {loaded && (
          <div class="portfolio__overlay" aria-hidden="true">
            <button
              class="portfolio__zoom"
              aria-label={`Ver ${photo.alt} en pantalla completa`}
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: GalleryPhoto[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const prev = useCallback(() => setIdx(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  return (
    <div
      class="lightbox open"
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imagen"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button class="lightbox__close" aria-label="Cerrar visor" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <button class="lightbox__prev" aria-label="Imagen anterior" onClick={prev}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button class="lightbox__next" aria-label="Imagen siguiente" onClick={next}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <div class="lightbox__content">
        <img src={photos[idx].src} alt={photos[idx].alt} />
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function PortfolioGallery({ photos, categories }: Props) {
  const [filter, setFilter] = useState('all');
  const [shown, setShown] = useState(BATCH);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const matching = filter === 'all'
    ? photos
    : photos.filter(p => p.category === filter);

  const visible = matching.slice(0, shown);
  const remaining = matching.length - shown;

  function changeFilter(id: string) {
    setFilter(id);
    setShown(BATCH);
    setLightboxIdx(null);
  }

  return (
    <>
      <div class="portfolio__filters" role="tablist" aria-label="Filtrar por categoría">
        {categories.map(cat => (
          <button
            key={cat.id}
            class={`portfolio__filter${filter === cat.id ? ' active' : ''}`}
            role="tab"
            aria-selected={filter === cat.id ? 'true' : 'false'}
            aria-controls="portfolio-grid"
            onClick={() => changeFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div class="portfolio__grid" id="portfolio-grid" role="tabpanel">
        {visible.map((photo, i) => (
          <PhotoItem
            key={photo.src}
            photo={photo}
            index={i}
            onOpen={() => setLightboxIdx(i)}
          />
        ))}
      </div>

      {remaining > 0 && (
        <div class="portfolio__more">
          <button
            class="portfolio__load-more"
            onClick={() => setShown(s => s + BATCH)}
            aria-label={`Cargar más fotografías, ${remaining} restantes`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <span>Cargar más fotos</span>
            <span class="portfolio__load-more-badge" aria-live="polite">{remaining}</span>
          </button>
        </div>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          photos={matching}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
