import { useEffect, useState, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaTwitter,
} from "react-icons/fa";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [events, setEvents] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [mouseDown, setMouseDown] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const prefersReducedMotion = usePrefersReducedMotion();

  const particles = useMemo(
    () =>
      new Array(18).fill(0).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 8,
        duration: 10 + Math.random() * 15,
        delay: Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    []
  );

  const t = {
    en: {
      events: "Upcoming Events",
      queens: "Meet the Queens",
      menu: "Our Menu",
      gallery: "Gallery",
      contact: "Contact Us",
      name: "Your Name",
      email: "Your Email",
      message: "Your Message",
      send: "Send",
      address: "Calle Casablanca, 6, 29620 Torremolinos, Málaga, España",
      owner: "Meet the Owner",
      ownerBio:
        "Hi! I'm Matthew — passionate about creating a vibrant, welcoming space for everyone. Expect great drinks, wild shows, and unforgettable vibes!",
      queenBios: [
        { name: "Queen Kartajena", bio: "Fierce, fabulous, and ready to slay." },
        { name: "Mave Raven", bio: "Serving glamour and attitude." },
        { name: "Lore Çe Pump", bio: "The queen of sass and sparkle." },
      ],
      cta: "Book a Table",
      loading: "Loading…",
    },
    es: {
      events: "Próximos Eventos",
      queens: "Conoce a las Reinas",
      menu: "Nuestra Carta",
      gallery: "Galería",
      contact: "Contáctanos",
      name: "Tu Nombre",
      email: "Tu Correo",
      message: "Tu Mensaje",
      send: "Enviar",
      address: "Calle Casablanca, 6, 29620 Torremolinos, Málaga, España",
      owner: "Conoce al Dueño",
      ownerBio:
        "¡Hola! Soy Matthew — apasionado por crear un espacio vibrante y acogedor para todos. Espera excelentes bebidas, espectáculos salvajes e inolvidables!",
      queenBios: [
        { name: "Queen Kartajena", bio: "Feroz, fabulosa y lista para brillar." },
        { name: "Mave Raven", bio: "Sirviendo glamour y actitud, toda la noche." },
        { name: "Lore Çe Pump", bio: "La reina del brillo y la chispa." },
      ],
      cta: "Reserva tu Mesa",
      loading: "Cargando…",
    },
  };

  useEffect(() => {
    document.title = "Pic-Nic Torremolinos";
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);

    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSv-w96-2pfVNMG3ejlpe4OnLjURfiRddcuwwqHoTohzk9mMO_VcmyN28lW7BXLqbbue4bjb5uOKaFI/pub?output=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const parsed = rows.map((line) => {
          const [date, emoji, title, time] = safeSplit(line);
          return { date, emoji, title, time };
        });
        setEvents(parsed);
      });

    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQsZGLwjbO6zngkVYbNScFVz1iho7L3eYS9pGWnxnq5fyh_8gyXCBRQh_0ls5sYfEUvSVJXKbpq99c5/pub?output=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const parsed = rows.map((line) => {
          const [item, emoji, price] = safeSplit(line);
          return { item, emoji, price };
        });
        setMenuItems(parsed);
      });

    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQV4QI8UV2U3Cym1lWblfYNWc7GY4XLxEE0fX3aAZ2ebEfnF0SDsn6q1ZSsrZjSA_ovTj1yJpxVBKfL/pub?output=csv"
    )
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const urls = rows.map((row) => safeSplit(row)[0]);
        setGalleryImages(urls);
      });

    const timeout = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    const down = () => setMouseDown(true);
    const up = () => setMouseDown(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [isTouch]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % galleryImages.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex(
          (i) => (i - 1 + galleryImages.length) % galleryImages.length
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, galleryImages.length]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetch("https://formspree.io/f/xyyqwjew", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    e.target.reset();
    alert("Message sent!");
  };

  const btnRef = useRef(null);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const magRotate = useTransform(magX, [-30, 30], [-5, 5]);

  const onMouseMoveMagnetic = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    magX.set(relX * 0.2);
    magY.set(relY * 0.2);
  };

  const resetMagnetic = () => {
    magX.set(0);
    magY.set(0);
  };

  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 16;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion]);

  return (
    <div className="relative overflow-hidden text-white font-sans">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-[70]"
        style={{
          scaleX,
          background: "linear-gradient(90deg,#ff00e6,#ffcc00)",
        }}
      />

      {!isTouch && !prefersReducedMotion && (
        <div
          className="fixed z-[100] pointer-events-none mix-blend-screen hidden md:block"
          style={{
            left: cursorPos.x - 10,
            top: cursorPos.y - 10,
            width: mouseDown ? 34 : 20,
            height: mouseDown ? 34 : 20,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.9), rgba(255,255,255,0))",
            filter: "blur(4px)",
            transition: "width 120ms, height 120ms",
          }}
        />
      )}

      {!prefersReducedMotion && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.left}%`,
                top: "-5%",
                width: p.size,
                height: p.size,
                borderRadius: "9999px",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)",
              }}
              initial={{ y: "-10%", opacity: 0 }}
              animate={{ y: "110%", opacity: [0, 1, 1, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

<div className="fixed inset-0 -z-20 bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 animate-gradient-move" />

      <div className="absolute top-4 right-4 z-40">
        <button
          className="bg-white/20 px-3 py-1 text-sm rounded-full backdrop-blur hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          aria-label="Toggle language"
        >
          {language === "en" ? "ES" : "EN"}
        </button>
      </div>

      <nav
        aria-label="social"
        className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex space-x-4"
      >
        {[
          ["https://facebook.com/PicNicTorremolinos", FaFacebookF],
          ["https://instagram.com/PicNicTorremolinos", FaInstagram],
          ["https://snapchat.com/add/PicNicTorremo", FaSnapchat],
          ["https://tiktok.com/@PicNicTorremolinos", FaTiktok],
          ["https://twitter.com/PicNicTorremo", FaTwitter],
        ].map(([url, Icon], i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
            aria-label={url}
          >
            <Icon className="text-xl hover:scale-125 transition-transform text-white drop-shadow" />
          </a>
        ))}
      </nav>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="https://myxxdev.github.io/images/rszPicNicOlive.png"
              initial={{ scale: 0.9, rotate: 0, opacity: 0 }}
              animate={{ scale: 1.18, rotate: 360, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 1.2,
                ease: "easeInOut",
              }}
              className="w-72 drop-shadow-[0_0_25px_rgba(255,255,255,0.28)]"
              alt="Pic-Nic Torremolinos"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="text-center pt-28 pb-24 relative overflow-hidden">
        <motion.img
          src="https://myxxdev.github.io/images/PicNicOlive.png"
          alt="Pic-Nic Torremolinos logo"
          initial={{ opacity: 0, scale: 0.5, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.9 }}
          style={{
            transform: prefersReducedMotion
              ? undefined
              : `translate3d(${parallax.x / 1.8}px, ${parallax.y / 1.8}px, 0)`,
          }}
          className="mx-auto w-44 mb-6 drop-shadow-[0_0_25px_rgba(0,0,0,0.2)] will-change-transform"
        />
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.7 }}
        >
          Pic‑Nic Torremolinos
        </motion.h1>

        <motion.button
  ref={btnRef}
  onMouseMove={onMouseMoveMagnetic}
  onMouseLeave={resetMagnetic}
  onClick={() =>
    document.querySelector("#contact-section")?.scrollIntoView({ behavior: "smooth" })
  }
  style={{
    x: magX,
    y: magY,
    rotate: magRotate,
  }}
  whileHover={{ scale: 1.06 }}
  whileTap={{ scale: 0.98 }}
  className="mt-8 inline-block rounded-full px-8 py-3 text-lg font-bold shadow-2xl backdrop-blur bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
>
  {t[language].cta} ✨
</motion.button>

      </header>

      <main className="max-w-6xl mx-auto px-4 space-y-24 relative z-10">
        {/* Events */}
        <SectionTitle>{t[language].events}</SectionTitle>
        <Card>
          {events.length === 0 ? (
            <p className="text-center text-white/70">{t[language].loading}</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {events.map((e, i) => (
                <motion.li
                  key={i}
                  className="flex justify-between py-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <span>
                    {e.emoji} {e.title}
                  </span>
                  <span className="text-white/60">
                    {e.date} @ {e.time}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>

        {/* Menu */}
        <SectionTitle>{t[language].menu}</SectionTitle>
        <Card>
          {menuItems.length === 0 ? (
            <p className="text-center text-white/70">{t[language].loading}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
              {menuItems.map((m, i) => (
                <motion.div
                  key={i}
                  className="text-lg flex justify-between items-center py-2 px-3 rounded-xl hover:bg-white/5 transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <span>
                    {m.emoji} {m.item}
                  </span>
                  <span className="text-white/80">{m.price}</span>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Gallery */}
        <SectionTitle>{t[language].gallery}</SectionTitle>
        <Card>
          {galleryImages.length === 0 ? (
            <p className="text-center text-white/70">{t[language].loading}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((url, i) => (
                <motion.img
                  key={i}
                  src={url}
                  whileHover={{ scale: 1.04 }}
                  onClick={() => setLightboxIndex(i)}
                  className="rounded-xl shadow-lg cursor-zoom-in object-cover aspect-square"
                  alt={`Gallery image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Queens */}
        <SectionTitle>{t[language].queens}</SectionTitle>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QueenCard
              img="https://myxxdev.github.io/images/PicNicTorremolinosQueenKartajena.png"
              name={t[language].queenBios[0].name}
              bio={t[language].queenBios[0].bio}
            />
            <QueenCard
              img="https://myxxdev.github.io/images/PicNicTorremolinosMaveRaven.png"
              name={t[language].queenBios[1].name}
              bio={t[language].queenBios[1].bio}
            />
            <QueenCard
              img="https://myxxdev.github.io/images/PicNicTorremolinosLoreCePump.png"
              name={t[language].queenBios[2].name}
              bio={t[language].queenBios[2].bio}
            />
          </div>
        </Card>

        {/* Owner */}
        <SectionTitle>{t[language].owner}</SectionTitle>
        <Card>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://myxxdev.github.io/images/PicNicTorremolinosMatthew.png"
              className="w-32 h-32 rounded-full shadow-lg object-cover"
              alt="Owner"
            />
            <p className="text-white/80 text-lg text-center md:text-left">
              {t[language].ownerBio}
            </p>
          </div>
        </Card>

        {/* Contact */}
        <SectionTitle id="contact-section">{t[language].contact}</SectionTitle>
        <Card>
          <form
            onSubmit={handleFormSubmit}
            className="max-w-xl mx-auto space-y-4"
          >
            <input
              name="name"
              required
              placeholder={t[language].name}
              className="w-full p-3 bg-white/20 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t[language].email}
              className="w-full p-3 bg-white/20 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <textarea
              name="message"
              rows="4"
              required
              placeholder={t[language].message}
              className="w-full p-3 bg-white/20 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <motion.button
              type="submit"
              className="w-full py-3 px-4 rounded-full font-bold text-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              style={{ backgroundColor: "#4f6c46", color: "#fff" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              {t[language].send}
            </motion.button>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-white/70 text-sm py-16 mt-24">
        <p>{t[language].address}</p>
        <p className="mt-1">© {new Date().getFullYear()} Pic-Nic Torremolinos</p>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.img
              src={galleryImages[lightboxIndex]}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              alt="Gallery enlarged"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setLightboxIndex(null)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- Components ----------------------------- */

function SectionTitle({ children }) {
  return (
    <motion.h2
      className="text-4xl font-extrabold text-center mb-10 text-white drop-shadow-lg leading-tight"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.h2>
  );
}

function Card({ children, className = "" }) {
  return (
    <motion.section
      className={`bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.section>
  );
}

function QueenCard({ img, name, bio }) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur p-4 rounded-xl shadow-lg overflow-hidden group"
      whileHover={{ scale: 1.03 }}
    >
      <motion.img
        src={img}
        className="rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
        alt={name}
      />
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm text-white/80 italic">{bio}</p>
    </motion.div>
  );
}

/* ----------------------------- Utils ----------------------------- */

function safeSplit(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return prefers;
}

