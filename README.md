# Base AI Ecosystem

An interactive 3D galaxy visualization of the Base AI ecosystem. Explore protocols, wallets, inference networks, and DeFi projects building on Base — navigate like a galaxy.

---

## Features

- **3D galaxy** — four solar systems (Wallets, x402, Inference, Trading & DeFi), each with orbiting planet-projects
- **Keyboard navigation** — arrow keys to move between systems, Enter to zoom in, ESC to zoom out, `/` to search
- **Search** — type to highlight matching projects across all systems
- **Ecosystem Map** — a shareable 1200×630 PNG market map at `/ecosystem-image`
- **Open contribution** — two JSON files anyone can PR to add their project

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `← ↑` | Previous solar system |
| `→ ↓` | Next solar system |
| `Enter` | Zoom into selected system |
| `Esc` | Zoom out / close overlay |
| `/` | Focus search bar |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The ecosystem image is available at [http://localhost:3000/ecosystem-image](http://localhost:3000/ecosystem-image).

## Deploying

This app is optimized for [Vercel](https://vercel.com). Connect your repo and deploy — no environment variables required.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on how to add your project to the galaxy or the ecosystem image.

- Adding to the **galaxy** (`data/galaxy.json`) is open to most projects
- Adding to the **ecosystem image** (`data/ecosystem-image.json`) requires demonstrated traction

**These must be separate PRs.**

## Data files

| File | Description |
|------|-------------|
| `data/galaxy.json` | All projects shown in the 3D galaxy |
| `data/ecosystem-image.json` | Curated subset shown in the shareable image |

## Tech stack

- [Next.js 16](https://nextjs.org) — App Router
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D rendering
- [@react-three/drei](https://github.com/pmndrs/drei) — Three.js helpers
- [GSAP](https://gsap.com) — camera animations
- [next/og](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — ecosystem image generation
- [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)

## License

MIT
