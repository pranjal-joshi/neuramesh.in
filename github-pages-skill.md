# GitHub Pages Deployment Agent Skill

## Overview

This skill describes how to update the NeuraMesh static website hosted on GitHub Pages at `https://pranjal-joshi.github.io/neuramesh.in/` with custom domain `https://neuramesh.in`.

## Prerequisites

- GitHub CLI (`gh`) authenticated as `pranjal-joshi`
- Local repo: the repository root (working directory)
- Remote repo: `github.com/pranjal-joshi/neuramesh.in`
- Cloudflare DNS: `neuramesh.in` CNAME → `pranjal-joshi.github.io` (proxied)
- Cloudflare SSL/TLS: **Full**

## Workflow

### 1. Make changes to site files

All site files are in the repository root

- **HTML pages**: `index.html`, `pricing.html`, `about.html`, `collaboration.html`, `404.html`
- **Images**: `assets/images/`
- **Videos**: `assets/videos/`
- Each page has inline `<style>`, inline `<script id="tailwind-config">`, and inline `<script>` — no external CSS/JS files are linked.

### 2. Stage, commit, and push

```powershell
git add -A
git commit -m "description of changes"
git push
```

The commit message should briefly describe the change (e.g., "fix hero video loop" or "update pricing cards").

### 3. Verify deployment

After pushing, GitHub Pages automatically rebuilds. The site is live within 1-2 minutes at:

- `https://pranjal-joshi.github.io/neuramesh.in/` (intermediate)
- `https://neuramesh.in/` (custom domain — via Cloudflare)

To verify:

```powershell
curl -s -o /dev/null -w "%{http_code}" https://neuramesh.in
```

Expected: `200`

### 4. If DNS issues occur

If `https://neuramesh.in` doesn't load:

1. Check DNS resolution:
   ```powershell
   nslookup neuramesh.in 8.8.8.8
   ```
2. Flush local DNS:
   ```powershell
   ipconfig /flushdns
   ```
3. If still failing, the local DNS resolver (Pi-hole / AdGuard at `127.0.0.2` on Wi-Fi) may be caching stale records. Restart it or temporarily switch to `8.8.8.8`:
   ```powershell
   netsh interface ip set dns "Wi-Fi" static 8.8.8.8
   ```
   To revert:
   ```powershell
   netsh interface ip set dns "Wi-Fi" dhcp
   ```

## Key Constraints

- **Static site only** — no WordPress, PHP, or database
- **Dark theme**: background `#0b1326`, primary green `#4edea3`, gold secondary `#e9c349`
- **Container max**: `1440px`, margin-desktop `64px`
- **Fonts**: Space Grotesk (headings), Manrope (body), JetBrains Mono (labels); icons: Material Symbols Outlined
- **Tailwind CDN** (`?plugins=forms,container-queries`) with `darkMode: "class"` via `<html class="dark">`
- **All CSS/JS inline** — no external file links
- **Nav links** use relative `.html` paths
- **Images** under `assets/images/`, **videos** under `assets/videos/`
- **Contact** is `about.html#contact` (no standalone contact page)
- **WhatsApp CTA**: `https://wa.me/message/ZLBCJCWUCGKDM1`
- **Instagram**: `https://www.instagram.com/neuramesh/`
- **Google Calendar Meet**: `https://calendar.google.com/calendar/u/0/r/eventedit?text=Meeting+with+NeuraMesh&details=Let%E2%80%99s+connect+to+discuss+smart+home+automation.&location=https://meet.google.com/&add=neurameshindia@gmail.com`
- **Contact email**: `neurameshindia@gmail.com`

## File Structure

```
neuramesh-site/
├── index.html              # Home page
├── pricing.html            # Pricing page
├── about.html              # About + Contact
├── collaboration.html      # Collaboration page
├── 404.html                # Error page
├── assets/
│   ├── images/             # PNG, JPG images
│   ├── videos/             # MP4 videos
│   ├── css/                # (unused legacy)
│   └── js/                 # (unused legacy)
└── github-pages-skill.md   # This file
```
