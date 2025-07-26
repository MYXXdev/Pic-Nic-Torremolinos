import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchat, FaTwitter } from "react-icons/fa";
import confetti from "canvas-confetti";

export default function App() {
  const [language, setLanguage] = useState("en");
  const [events, setEvents] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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
      send: "Send Message",
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
      send: "Enviar Mensaje",
      address: "Calle Casablanca, 6, 29620 Torremolinos, Málaga, España",
      owner: "Conoce al Dueño",
      ownerBio:
        "¡Hola! Soy Matthew — apasionado por crear un espacio vibrante y acogedor para todos. ¡Espera excelentes bebidas, espectáculos salvajes e inolvidables!",
      queenBios: [
        { name: "Queen Kartajena", bio: "Feroz, fabulosa y lista para brillar." },
        { name: "Mave Raven", bio: "Sirviendo glamour y actitud, toda la noche." },
        { name: "Lore Çe Pump", bio: "La reina del brillo y la chispa." },
      ],
    },
  };

  useEffect(() => {
    document.title = "Pic-Nic Torremolinos";

    // Trigger confetti on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#99a938", "#d2dc9b", "#3f4313"],
    });

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

    const timeout = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    fetch("https://formspree.io/f/xyyqwjew", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    }).then(() => {
      e.target.reset();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#99a938", "#d2dc9b"],
      });
      alert("Message sent!");
    });
  };

  const SectionTitle = ({ children }) => (
    <motion.h2
      className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-olive-300 to-olive-600"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.h2>
  );

  const Card = ({ children, className }) => (
    <motion.div
      className={`bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all ${className}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="relative overflow-hidden text-white font-sans min-h-screen">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 -z-10 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-olive-400 via-olive-600 to-olive-800 opacity-90 animate-pulse-slow"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[url('https://myxxdev.github.io/images/noise.png')] opacity-10" />
      </motion.div>

      {/* Language Toggle */}
      <motion.div
        className="absolute top-4 right-4 z-40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        <button
          className="bg-gradient-to-r from-olive-500 to-olive-700 px-4 py-2 text-sm rounded-full hover:scale-110 transition-transform shadow-lg"
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
        >
          {language === "en" ? "ES" : "EN"}
        </button>
      </motion.div>

      {/* Social Icons */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 flex space-x-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        {[
          ["https://facebook.com/PicNicTorremolinos", FaFacebookF],
          ["https://instagram.com/PicNicTorremolinos", FaInstagram],
          ["https://snapchat.com/add/PicNicTorremo", FaSnapchat],
          ["https://tiktok.com/@PicNicTorremolinos", FaTiktok],
          ["https://twitter.com/PicNicTorremo", FaTwitter],
        ].map(([url, Icon], i) => (
          <motion.a
            key={i}
            href={url}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.3, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="text-2xl text-white drop-shadow-lg hover:text-olive-300 transition-colors"
            animate={{ scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2, delay: i * 0.2 } }}
          >
            <Icon />
          </motion.a>
        ))}
      </motion.div>

      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src="https://myxxdev.github.io/images/rszPicNicOlive.png"
              initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
              animate={{ scale: 1.3, rotate: 360, opacity: 1 }}
              exit={{ scale: 0.2, opacity: 0 }}
              transition={{ duration: 2, ease: "anticipate" }}
              className="w-80"
              onAnimationComplete={() =>
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.5 },
                  colors: ["#99a938", "#d2dc9b", "#3f4313"],
                })
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="text-center pt-24 pb-12 relative">
        <motion.img
          src="https://myxxdev.github.io/images/PicNicOlive.png"
          alt="Logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 1, ease: "backOut" }}
          className="mx-auto w-52 mb-6 drop-shadow-2xl"
        />
        <motion.h1
          className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-olive-300 to-olive-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          Pic-Nic Torremolinos
        </motion.h1>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-16 pb-20">
        {/* Events - Scrolling Marquee */}
        <SectionTitle>{t[language].events}</SectionTitle>
        <Card>
          {events.length === 0 ? (
            <p className="text-center text-white/70 animate-pulse">Loading events...</p>
          ) : (
            <motion.div
              className="overflow-hidden"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <div className="flex space-x-6 whitespace-nowrap">
                {[...events, ...events].map((e, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-olive-400/20 to-olive-600/20 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <div>
                      <p className="font-bold">{e.title}</p>
                      <p className="text-sm text-white/60">{e.date} @ {e.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </Card>

        {/* Menu */}
        <SectionTitle>{t[language].menu}</SectionTitle>
        <Card>
          {menuItems.length === 0 ? (
            <p className="text-center text-white/70 animate-pulse">Loading menu...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((m, i) => (
                <motion.div
                  key={i}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-olive-400/20 to-olive-600/20 rounded-lg"
                  whileHover={{ scale: 1.03, x: 10 }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <div>
                    <p className="font-semibold">{m.item}</p>
                    <p className="text-white/60">{m.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Gallery with Lightbox */}
        <SectionTitle>{t[language].gallery}</SectionTitle>
        <Card>
          {galleryImages.length === 0 ? (
            <p className="text-center text-white/70 animate-pulse">Loading gallery...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((url, i) => (
                <motion.img
                  key={i}
                  src={url}
                  onClick={() => setSelectedImage(url)}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="rounded-xl shadow-lg cursor-pointer object-cover h-40 w-full"
                />
              ))}
            </div>
          )}
        </Card>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.img
                src={selectedImage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="max-w-[90%] max-h-[90%] rounded-xl shadow-2xl border-2 border-olive-400"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meet the Queens */}
        <SectionTitle>{t[language].queens}</SectionTitle>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t[language].queenBios.map((queen, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-b from-olive-400/20 to-olive-600/20 p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 1 }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <img
                  src={`https://myxxdev.github.io/images/PicNicTorremolinos${queen.name.replace(/\s/g, "")}.png`}
                  className="rounded-lg mb-4 w-full h-64 object-cover"
                />
                <h3 className="text-2xl font-bold mb-2 text-olive-300">{queen.name}</h3>
                <p className="text-sm text-white/80 italic">{queen.bio}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Meet the Owner */}
        <SectionTitle>{t[language].owner}</SectionTitle>
        <Card>
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="https://myxxdev.github.io/images/PicNicTorremolinosMatthew.png"
              className="w-40 h-40 rounded-full shadow-xl border-4 border-olive-400/50"
              whileHover={{ rotate: 360, transition: { duration: 1 } }}
            />
            <p className="text-lg text-white/80 text-center md:text-left leading-relaxed">
              {t[language].ownerBio}
            </p>
          </motion.div>
        </Card>

        {/* Contact */}
        <SectionTitle>{t[language].contact}</SectionTitle>
        <Card>
          <motion.form
            onSubmit={handleFormSubmit}
            className="max-w-xl mx-auto space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <input
              name="name"
              required
              placeholder={t[language].name}
              className="w-full p-3 bg-white/10 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-olive-400 transition-all"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t[language].email}
              className="w-full p-3 bg-white/10 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-olive-400 transition-all"
            />
            <textarea
              name="message"
              rows="4"
              required
              placeholder={t[language].message}
              className="w-full p-3 bg-white/10 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-olive-400 transition-all"
            />
            <motion.button
              type="submit"
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-olive-500 to-olive-700 hover:from-olive-600 hover:to-olive-800 text-white font-bold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0 0 0 rgba(153,169,56,0.5)", "0 0 20px rgba(153,169,56,0.8)", "0 0 0 rgba(153,169,56,0.5)"] }}
              transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
            >
              {t[language].send}
            </motion.button>
          </motion.form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-white/70 text-sm py-10 bg-gradient-to-t from-black/50 to-transparent">
        <p className="mb-2">{t[language].address}</p>
        <p>© {new Date().getFullYear()} Pic-Nic Torremolinos</p>
      </footer>
    </div>
  );
}