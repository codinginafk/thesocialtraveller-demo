export default function SiteFooter({
  youtubeUrl,
  instagramUrl,
  facebookUrl,
}: {
  youtubeUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}) {
  const yt = youtubeUrl || "https://youtube.com/@TheSocialTraveller-2021";
  const ig = "https://www.instagram.com/thesocialtraveller_2021/";
  const fb = "https://www.facebook.com/profile.php?id=61559573067044";

  return (
    <footer className="relative overflow-hidden">
      {/* Jungle background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/footer-bg.jpg)" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-bark/70" />
      {/* Light rays overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cream/[0.03] to-transparent" />

      <div className="relative z-10">
        <div className="container-page flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center">
          <blockquote className="max-w-lg">
            <span className="block font-serif text-5xl text-clay">&ldquo;</span>
            <p className="mt-2 font-serif text-2xl italic text-cream md:text-3xl">
              The mountains don&apos;t need visitors. They need guardians.
            </p>
            <p className="mt-4 text-sm text-cream/60">— TheSocialTraveller</p>
          </blockquote>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <nav aria-label="Social links" className="flex gap-4">
              <a href={yt} target="_blank" rel="noopener noreferrer" className="text-cream/60 transition-colors hover:text-cream" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href={ig} target="_blank" rel="noopener noreferrer" className="text-cream/60 transition-colors hover:text-cream" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </a>
              <a href={fb} target="_blank" rel="noopener noreferrer" className="text-cream/60 transition-colors hover:text-cream" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </nav>
            <a href="mailto:info@thesocialtraveller.in" className="text-sm text-cream/60 transition-colors hover:text-cream">
              hello@thesocialtraveller.in
            </a>
          </div>
        </div>
        <div className="border-t border-cream/15">
          <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-xs text-cream/40 sm:flex-row">
            <span>© 2026 TheSocialTraveller. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
