# CyberDict

CyberDict is a community cybersecurity dictionary and visual knowledge explorer for offensive security, defensive security, purple teaming, identity, vulnerability research and AI security.

The project is designed around a simple flow: discover a term, understand it quickly, then open the full term page for a deeper textual and visual explanation.

## Features

- Searchable cybersecurity dictionary
- Category and knowledge-sector browsing
- Individual term pages with simple and technical explanations
- Offensive and defensive relevance
- Full visual explainers with click-to-open lightbox viewing
- Compact homepage previews so the landing page stays fast and uncluttered
- MITRE ATT&CK, CWE and OWASP mappings where relevant
- Related-term navigation
- Responsive dark CyberDict interface
- Static-first deployment for Cloudflare Workers

## Visual Knowledge Library

CyberDict uses dedicated visual explainers for core concepts. The current visual set includes CTF, C2, Red Team, Blue Team, Purple Team, SOC, SIEM, EDR, OSINT, Phishing, Privilege Escalation, Persistence, Lateral Movement, Pivoting, TTPs, IoC, MITRE ATT&CK, Vulnerability, Exploit, Incident Response, Threat Hunting, Zero Trust, Ransomware and MFA.

Homepage cards use lightweight previews. The complete infographic is displayed only on the individual term page.

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
│   │   ├── categories.json
│   │   ├── relations.json
│   │   └── terms.json
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

Then open `http://localhost:8000`.

## Cloudflare Deployment

```bash
npx wrangler deploy
```

The production site is available at `https://cyberdict.asifnawazminhas.com`.

## Contributing

Contributions that improve definitions, relationships, visual explanations or knowledge coverage are welcome. Keep explanations clear, technically accurate and useful to security learners and practitioners.

## Author

Asif Nawaz Minhas

- https://github.com/asifnawazminhas
- https://notes.asifnawazminhas.com
- https://oneliners.asifnawazminhas.com
- https://studio.asifnawazminhas.com
- https://ai.asifnawazminhas.com

## License

MIT
