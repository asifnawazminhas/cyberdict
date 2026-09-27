# CyberDict

CyberDict is a community cybersecurity dictionary and visual knowledge explorer for offensive security, defensive security, purple teaming, identity, vulnerability research and AI security.

The project follows a simple flow: discover a term, understand it quickly, then open the term page for a deeper textual and visual explanation.

## Features

- Searchable cybersecurity dictionary
- Category and knowledge-sector browsing
- Individual term pages with simple and technical explanations
- Offensive and defensive relevance
- Full visual explainers with click-to-open lightbox viewing
- Compact homepage previews so the landing page stays fast and uncluttered
- MITRE ATT&CK, CWE and OWASP mappings where relevant
- Related-term navigation
- Responsive dark interface
- Static-first deployment for Cloudflare Workers

## Visual Standard

Core visual explainers use a consistent educational structure without embedded site branding or unrelated domain names:

1. Term title and one-line explanation
2. Five concept-specific visual explanation blocks
3. A concept diagram or workflow unique to the term
4. Three concise key takeaways
5. Full image on the term page, with a compact preview on the homepage

The first five terms standardised to this format are CTF, C2, Red Team, Blue Team and Purple Team.

## Structure

```text
cyberdict/
├── public/
│   ├── assets/
│   │   ├── css/
│   │   ├── img/
│   │   │   ├── previews/
│   │   │   └── terms/
│   │   └── js/
│   ├── data/
│   ├── about/
│   ├── category/
│   ├── explore/
│   ├── learn/
│   ├── term/
│   └── index.html
├── LICENSE
├── README.md
└── wrangler.toml
```

## Local Preview

```bash
python3 -m http.server 8000 -d public
```

## Cloudflare Deployment

```bash
npx wrangler deploy
```

Production: `https://cyberdict.asifnawazminhas.com`

## Contributing

Contributions that improve definitions, relationships, visual explanations or knowledge coverage are welcome. Keep explanations clear, technically accurate and useful to security learners and practitioners.

## Author

Asif Nawaz Minhas

## License

MIT
