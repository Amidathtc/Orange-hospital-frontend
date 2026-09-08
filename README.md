# 🏥 Orange Hospital Frontend

A modern React + TypeScript frontend for the Orange Hospital management system, built with Vite and TailwindCSS.

## 🚀 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — blazing fast build tool
- **TailwindCSS** — utility-first styling
- **React Router v6** — client-side routing

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable        | Description               | Example                        |
|-----------------|---------------------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL      | `https://api.yourdomain.com`   |

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## 🌐 Deployment

This project is configured for **Vercel** deployment. The `vercel.json` handles SPA routing rewrites.

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set `VITE_API_URL` in Vercel Environment Variables
4. Deploy!
