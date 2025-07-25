import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaTwitter } from "react-icons/fa";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [events, setEvents] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showIntro, setShowIntro] = useState(true);

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
        { name: "Reina 1", bio: "Feroz, fabulosa y lista para brillar." },
        { name: "Reina 2", bio: "Sirviendo glamour y actitud, toda la noche." },
        { name: "Reina 3", bio: "La reina del brillo y la chispa." },
      ],
    },
  };

  useEffect(() => {
    document.title = "Pic-Nic Torremolinos";

    // Fetch Events
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSv-w96-2pfVNMG3ejlpe4OnLjURfiRddcuwwqHoTohzk9mMO_VcmyN28lW7BXLqbbue4bjb5uOKaFI/pub?output=csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const parsed = rows.map((line) => {
          const [date, emoji, title, time] = line.split(",");
          return { date, emoji, title, time };
        });
        setEvents(parsed);
      });

    // Fetch Menu
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQsZGLwjbO6zngkVYbNScFVz1iho7L3eYS9pGWnxnq5fyh_8gyXCBRQh_0ls5sYfEUvSVJXKbpq99c5/pub?output=csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const parsed = rows.map((line) => {
          const [item, emoji, price] = line.split(",");
          return { item, emoji, price };
        });
        setMenuItems(parsed);
      });

    // Fetch Gallery
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQV4QI8UV2U3Cym1lWblfYNWc7GY4XLxEE0fX3aAZ2ebEfnF0SDsn6q1ZSsrZjSA_ovTj1yJpxVBKfL/pub?output=csv")
      .then((res) => res.text())
      .then((text) => {
        const rows = text.trim().split("\n").slice(1);
        const urls = rows.map((row) => row.split(",")[0]);
        setGalleryImages(urls);
      });

    const timeout = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timeout);
  }, []);

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

  const SectionTitle = ({ children }) => (
    <h2 className="text-3xl font-bold text-center mb-2 text-white">
      {children}
    </h2>
  );

  const Card = ({ children }) => (
    <motion.div
      className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative overflow-hidden text-white font-sans">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-fuchsia-600 via-indigo-800 to-rose-600 animate-pulse-slow" />

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <button
          className="bg-white/20 px-3 py-1 text-sm rounded-full backdrop-blur hover:bg-white/30"
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
        >
          {language === "en" ? "ES" : "EN"}
        </button>
      </div>

{/* Social Icons - Top Center */}
<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4">
  {[["https://facebook.com/PicNicTorremolinos", FaFacebookF],
    ["https://instagram.com/PicNicTorremolinos", FaInstagram],
    ["https://snapchat.com/add/PicNicTorremo", FaSnapchat],
    ["https://tiktok.com/@PicNicTorremolinos", FaTiktok],
    ["https://twitter.com/PicNicTorremo", FaTwitter]
  ].map(([url, Icon], i) => (
    <a key={i} href={url} target="_blank" rel="noreferrer">
      <Icon className="text-xl hover:scale-125 transition-transform text-white drop-shadow" />
    </a>
  ))}
</div>


      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1 }}>
            <motion.img
              src="https://myxxdev.github.io/images/rszPicNicOlive.png"
              initial={{ scale: 1, rotate: 0, opacity: 0 }}
              animate={{ scale: 1.2, rotate: 360, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="w-72"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="text-center pt-24 pb-12">
        <motion.img
          src="https://myxxdev.github.io/images/PicNicOlive.png"
          alt="Logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mx-auto w-44 mb-4"
        />
      </header>

      <main className="max-w-5xl mx-auto px-4 space-y-12">
        {/* Events */}
        <SectionTitle>{t[language].events}</SectionTitle>
        <Card>
          {events.length === 0 ? <p className="text-center text-white/70">Loading events...</p> :
            events.map((e, i) => (
              <div key={i} className="flex justify-between py-1 border-b border-white/10">
                <span>{e.emoji} {e.title}</span>
                <span className="text-white/60">{e.date} @ {e.time}</span>
              </div>
            ))
          }
        </Card>

        {/* Menu */}
        <SectionTitle>{t[language].menu}</SectionTitle>
        <Card>
          {menuItems.length === 0 ? <p className="text-center text-white/70">Loading menu...</p> :
            menuItems.map((m, i) => (
              <div key={i} className="text-lg text-center py-1">{m.emoji} {m.item} – {m.price}</div>
            ))
          }
        </Card>

        {/* Gallery */}
        <SectionTitle>{t[language].gallery}</SectionTitle>
        <Card>
          {galleryImages.length === 0 ? (
            <p className="text-center text-white/70">Loading gallery...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((url, i) => (
                <motion.img
                  key={i}
                  src={url}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl shadow-lg"
                />
              ))}
            </div>
          )}
        </Card>

        {/* Meet the Queens */}
        <SectionTitle>{t[language].queens}</SectionTitle>
<Card>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <motion.div className="bg-white/10 backdrop-blur p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.03 }}>
      <img src="https://myxxdev.github.io/images/PicNicTorremolinosQueenKartajena.png" className="rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-1">{t[language].queenBios[0].name}</h3>
      <p className="text-sm text-white/80 italic">{t[language].queenBios[0].bio}</p>
    </motion.div>
    <motion.div className="bg-white/10 backdrop-blur p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.03 }}>
      <img src="https://myxxdev.github.io/images/PicNicTorremolinosMaveRaven.png" className="rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-1">{t[language].queenBios[1].name}</h3>
      <p className="text-sm text-white/80 italic">{t[language].queenBios[1].bio}</p>
    </motion.div>
    <motion.div className="bg-white/10 backdrop-blur p-4 rounded-xl shadow-lg" whileHover={{ scale: 1.03 }}>
      <img src="https://myxxdev.github.io/images/PicNicTorremolinosLoreCePump.png" className="rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-1">{t[language].queenBios[2].name}</h3>
      <p className="text-sm text-white/80 italic">{t[language].queenBios[2].bio}</p>
    </motion.div>
  </div>
</Card>

        {/* Meet the Owner */}
        <SectionTitle>{t[language].owner}</SectionTitle>
        <Card>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img src="https://myxxdev.github.io/images/PicNicTorremolinosMatthew.png" className="w-32 h-32 rounded-full shadow-lg" />
            <p className="text-white/80 text-lg text-center md:text-left">{t[language].ownerBio}</p>
          </div>
        </Card>

        {/* Contact */}
        <SectionTitle>{t[language].contact}</SectionTitle>
        <Card>
          <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto space-y-4">
            <input name="name" required placeholder={t[language].name}
              className="w-full p-2 bg-white/20 text-white placeholder-white/70 rounded" />
            <input name="email" type="email" required placeholder={t[language].email}
              className="w-full p-2 bg-white/20 text-white placeholder-white/70 rounded" />
            <textarea name="message" rows="4" required placeholder={t[language].message}
              className="w-full p-2 bg-white/20 text-white placeholder-white/70 rounded" />
            <button type="submit"
              className="w-full py-2 px-4 rounded-full transition"
              style={{ backgroundColor: "#4f6c46", color: "#fff" }}>
              {t[language].send}
            </button>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-white/70 text-sm py-10 mt-10">
        <p>{t[language].address}</p>
        <p className="mt-1">© {new Date().getFullYear()} Pic-Nic Torremolinos</p>
      </footer>
    </div>
  );
}
