# Pankaj Umbarkar: portfolio

Static site: HTML, CSS and Bootstrap 5. No build step. Works on GitHub Pages.

```
index.html
css/style.css
js/config.js        <- edit your links here
js/main.js
assets/profile.jpg  <- your photo (left panel, click to enlarge)
assets/resume.pdf   <- your resume (Resume buttons download it)
assets/logos/       <- company and university logos
assets/favicon.png  <- optional tab icon
```

## 1. Set your links: `js/config.js`
- `githubUser`, `leetcodeUser`, `email`, `linkedin`, `resume`. The icons at the top right of the page use these.
  Set a value to `''` to hide that icon.
- `repos`: one repository name per project. `'goodgrub'` becomes `https://github.com/<githubUser>/goodgrub`.
  Paste a full URL instead if you like. `''` hides that project's "Source code" link.
- `publications`: the link icon on each publication card. The defaults are placeholders (a Medium search and your LinkedIn
  publications page). Replace them with the direct article links.

## 2. Add your photo, resume and logos
- Photo: `assets/profile.jpg` (square works best). Until it exists, the initials "PU" show.
- Resume: `assets/resume.pdf`.
- Logos: save each one in `assets/logos/` with exactly these names. `.png`, `.svg`, `.webp` or `.jpg` all work:

  | File name | Used for |
  |---|---|
  | `ubs` | every role in Experience |
  | `vit` | Education |
  | `microsoft` | Certifications |
  | `anthropic` | Certifications |
  | `gitlab` | Certifications |
  | `coursera` | Certifications |

  Until a logo file exists, a neutral icon shows in its place. Square images with a transparent or white background
  look best. Get the files from each organisation's official brand or press page and follow their usage rules.

## Deploy on GitHub Pages
1. Create a repo named `<your-username>.github.io` and push these files to `main`.
2. Settings, Pages, Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site goes live at `https://<your-username>.github.io/`.

## Notes
- Body font is Calibri, with Carlito (a metric-compatible match) as the fallback on devices without Calibri.
- Icons are inline SVG, so they never fail to load.
- Light and dark theme: the bulb icon at the top right stays pinned while you scroll and remembers the choice.
- Achievements show the first six; the button below them expands the rest. The "Newest first" button flips the order.
- Projects show the first four; the button below them expands the rest.
- Top-right icons: drop `linkedin`, `github`, `leetcode` and `mail` logo files (png/svg/webp/jpg) into `assets/logos/`; until then plain icons show.
- Changing employer or university: use a new key as `data-logo="newkey"` in `index.html` and save `assets/logos/newkey.png` (or .svg/.webp/.jpg). To reuse a key with a different file, set it under `logos` in `js/config.js`. Names and text stay in `index.html`.
- Colours: edit `--accent`, `--accent-solid`, `--accent-deep` (and the dark-mode set) at the top of `css/style.css`.
- A back-to-top arrow appears bottom right after scrolling.
