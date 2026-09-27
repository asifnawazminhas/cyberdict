# CyberDict

CyberDict is a community cybersecurity dictionary and interactive knowledge explorer for offensive security, defensive security, purple teaming and AI security.

## v0.1

This first release establishes the design system and static-first architecture.

### Included

- Green/black CyberDict interface inspired by the visual language of `about.asifnawazminhas.com`
- Searchable seed dictionary
- Knowledge-sector/category browsing
- Individual term pages
- Offensive and defensive context
- MITRE ATT&CK / CWE / OWASP fields
- Related-term relationships
- Explore, Learn and About pages
- Ask AI placeholder for a later release
- Responsive layout
- Cloudflare static-assets configuration

## Structure

```text
cyberdict/
├── public/
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/app.js
│   ├── data/
│   │   ├── categories.json
│   │   ├── terms.json
│   │   └── relations.json
│   ├── term/
│   ├── category/
│   ├── explore/
│   ├── learn/
│   ├── about/
│   ├── index.html
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── LICENSE
├── README.md
└── wrangler.toml
```

## Local preview

Any static HTTP server can serve `public/`, for example:

```bash
python3 -m http.server 8000 -d public
```

Then open `http://localhost:8000`.

## Cloudflare

The repository includes `wrangler.toml` for Cloudflare Workers static assets.

```bash
npx wrangler deploy --assets ./public/
```

## Author

Asif Nawaz Minhas

- https://github.com/asifnawazminhas
- https://notes.asifnawazminhas.com
- https://oneliners.asifnawazminhas.com
- https://studio.asifnawazminhas.com
- https://ai.asifnawazminhas.com

## License

MIT

## v0.2

- Rebuilt the homepage into a more premium cybersecurity knowledge platform.
- Reduced repetitive neon-green outlines and introduced stronger content hierarchy.
- Added layered charcoal cards, selective green glow, cyan/amber/violet mode accents and improved spacing.
- Added a new hero visual and refined search experience.
- Added 20 essential cybersecurity explanations:
  CTF, C2, Red Team, Blue Team, Purple Team, SOC, SIEM, EDR, OSINT, Phishing,
  Privilege Escalation, Persistence, Lateral Movement, Pivoting, TTPs, IoC,
  MITRE ATT&CK, Vulnerability, Exploit and Incident Response.
- Added a dedicated visual SVG for every one of those 20 terms.
- Added term-page visual artwork.
- Added a 20-term visual explainer section on the homepage.
