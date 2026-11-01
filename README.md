# Pankaj Umbarkar: portfolio

Static site: HTML, CSS and Bootstrap 5. No build step. Works on GitHub Pages.

```
index.html
css/style.css
js/config.js        <- edit your links here
js/main.js
assets/profile.jpg  <- your photo (shown in the left panel, click to enlarge)
assets/resume.pdf   <- your resume (Resume buttons download it)
assets/logos/       <- optional company logos (see below)
```

## 1. Set your links: `js/config.js`
- `githubUser`, `email`, `linkedin`, `resume`
- `repos`: one repository name per project. `'goodgrub'` becomes `https://github.com/<githubUser>/goodgrub`.
  Paste a full URL instead if you like. Leave `''` to hide that project's "Source code" link.
- `publications`: paste the article URLs. Empty values hide the link.

## 2. Add your photo, resume and logos
- Photo: `assets/profile.jpg` (square works best). Until it exists, the initials "PU" show.
- Resume: `assets/resume.pdf`.
- Company logos (optional): the page shows a clean icon by default. To use the real logo, save it as a PNG at
  `assets/logos/<name>.png` with one of these names: `ubs`, `vit`, `microsoft`, `anthropic`, `gitlab`, `coursera`.
  It appears automatically and replaces the icon.

## Deploy on GitHub Pages
1. Create a repo named `<your-username>.github.io` and push these files to `main`.
2. Settings, Pages, Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site goes live at `https://<your-username>.github.io/`.

## Notes
- Body font is Calibri, with Carlito (a metric-compatible match) as the fallback on devices without Calibri.
- Icons are inline SVG, so they never fail to load.
- Light and dark theme: the toggle is at the bottom of the left panel and remembers the choice.
