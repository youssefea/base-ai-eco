# Contributing to Base AI Ecosystem

Thanks for building on Base. This repo has two ways to contribute — read carefully, they have different rules.

---

## How this repo works

Two JSON files power this site:

| File | Purpose | Bar |
|------|---------|-----|
| `data/galaxy.json` | Powers the 3D galaxy visualization | **Open** — most projects qualify |
| `data/ecosystem-image.json` | Powers the shareable ecosystem map image | **Strict** — significant traction required |

> **IMPORTANT:** These must be separate PRs. Do not edit both files in the same pull request.

---

## Option 1 — Add your project to the Galaxy (`galaxy.json`)

The galaxy is meant to be comprehensive. If you're building on Base in one of the existing categories, you can add your project.

### Requirements

- Your project must be live (not just announced)
- Must fit one of the existing categories: `wallets`, `x402`, `inference`, or `defi`
- Logo must be a **stable, publicly accessible URL** (your own CDN, official GitHub raw link, etc.)
- Description must be **100 characters or fewer**
- No duplicate projects (check the file first)

### JSON schema

Add your project object to the correct category's `projects` array in `data/galaxy.json`:

```json
{
  "id": "your-project-id",
  "name": "Your Project Name",
  "description": "One sentence, max 100 chars, what you do on Base.",
  "website": "https://your-project.xyz",
  "logoUrl": "https://stable-cdn.example.com/your-logo.png",
  "twitter": "https://x.com/yourhandle"
}
```

- `id` — lowercase, hyphen-separated, unique (e.g. `"my-project"`)
- `twitter` — optional

### PR process

1. Fork the repo
2. Edit `data/galaxy.json` only
3. Open a PR titled: `[Galaxy] Add <YourProjectName>`
4. In the PR description, include a brief note on what you're building

---

## Option 2 — Add your project to the Ecosystem Image (`ecosystem-image.json`)

> ⚠️ **Stricter requirements. Separate PR required.**

The ecosystem image is a curated snapshot that gets shared widely. It must only include projects with demonstrated traction on Base.

### Requirements

Your project must have **at least one** of the following, with evidence linked in the PR:

- Active users / wallet connects (screenshots or public dashboard)
- Meaningful TVL, volume, or API usage stats
- A public launch with notable community reception (announcement post, etc.)
- Integration adopted by other builders in the ecosystem

### PR process

1. Fork the repo
2. Edit `data/ecosystem-image.json` only — **do NOT touch `galaxy.json` in this PR**
3. Open a PR titled: `[EcoImage] Add <YourProjectName>`
4. In the PR description, provide:
   - Link to your project
   - Evidence of traction (public metrics, announcement links, user stats)
5. PRs without evidence will not be merged

---

## Want to add a new category?

Open an issue first and describe the category you'd like to add and why it makes sense for the Base AI ecosystem. We'll discuss before accepting PRs that add new categories.

---

## General guidelines

- Keep descriptions factual and neutral — no marketing language
- Don't submit projects that are unrelated to the Base AI ecosystem
- One PR per project, not batches of unrelated projects
- Be patient — reviews happen on a best-effort basis
