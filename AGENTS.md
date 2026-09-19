## Project

UrbanSafe landing page: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui.
The product specification for the UrbanSafe MVP lives in the separate UrbanSafeApp project (`docs/spec.md`).

## Development

```
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

`next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `next build` does not catch type errors. Run `npx tsc --noEmit` to type-check.

## Structure

- `app/` — routes, root layout, global styles (`app/globals.css`)
- `components/landing/` — landing page sections
- `components/ui/` — shadcn/ui primitives (add new ones with `npx shadcn@latest add <component>`)
- `hooks/`, `lib/` — shared hooks and utilities
- Import alias: `@/*` maps to the project root

## Documentation

- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/docs
