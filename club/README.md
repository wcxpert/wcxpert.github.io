# ⚽ Football Club Randomiser

A modern web app that randomly selects a football club from the **top European leagues**. Clubs spin rapidly for a few seconds before landing on one final result — complete with crest, name, and league info.

---

## 📂 Repository Structure

```
football-randomiser/
│
├── index.html                # Main app (modern UI, randomiser logic)
│
├── /leagues/                 # League data files (JS arrays)
│   ├── premier-league.js
│   ├── la-liga.js
│   ├── bundesliga.js
│   ├── serie-a.js
│   └── ligue-1.js
│
├── /images/                  # Club crest images (PNG/SVG)
│   ├── arsenal.png
│   ├── barcelona.png
│   ├── psg.png
│   └── ... etc
│
├── /css/ (optional)          # External styles if splitting CSS out
│   └── styles.css
│
└── /js/ (optional)           # If moving inline scripts out of index.html
    └── app.js
```

---

## 🚀 Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/football-randomiser.git
   cd football-randomiser
   ```

2. **Open locally:**

   * Just double-click `index.html` → it will open in your browser.
   * No server needed (works offline).

3. **Choose leagues:**

   * Click **Settings** in the app.
   * Toggle which leagues you want to include.
   * Press **Randomise** to spin and land on a random club.

---

## 🏆 Features

* Modern, responsive UI with animated cycling.
* Works with multiple leagues — Premier League, La Liga, Bundesliga, Serie A, Ligue 1 (25/26 season data).
* Club objects include:

  ```js
  { name: "Arsenal", short: "ARS", image: "images/arsenal.png" }
  ```
* Missing images automatically generate an SVG badge with initials.
* Adjustable spin duration (1–10 seconds).

---

## 🖼️ Adding Club Images

1. Place crest PNGs/SVGs in `/images/`.
2. Use lowercase/underscored filenames for consistency (`arsenal.png`, `real_madrid.png`).
3. Update the `image` field in the league JS files if needed.

If an image is missing, the app will generate a **placeholder SVG** with the club’s initials.

---

## ➕ Adding a New League

1. Create a new file in `/leagues/` (e.g., `eredivisie.js`).
2. Define the league array:

   ```js
   window.LEAGUE_eredivisie = [
     { name: "Ajax", short: "AJA", image: "images/ajax.png" },
     { name: "PSV", short: "PSV", image: "images/psv.png" },
     // ...more clubs
   ];
   ```
3. Add an entry in the `FALLBACK_LEAGUES` object inside `index.html` with the league’s ID, label, and file path.

---

## 🌍 Deployment

* Works out of the box with **GitHub Pages**, **Netlify**, or any static site host.
* To deploy on GitHub Pages:

  1. Push this repo to GitHub.
  2. Go to **Settings → Pages → Deploy from Branch → `main` branch**.
  3. Your app will be live at `https://your-username.github.io/randomclub/`.

https://wcxpert.github.io/randomclub

---

## 📜 License

MIT License — free to use and modify.

---

👨‍💻 Built with ❤️ for football fans and coders alike.
