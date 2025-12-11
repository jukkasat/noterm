
# noter m.

noter m. is a lightweight, digital note board built with React, TypeScript, TailwindCSS and shadcn/ui. It includes local persistence, export/import functionality and works as a fully Progressive Web App (PWA).


## Quick links

- Project overview and design rules: [AGENTS.md](AGENTS.md)
- App entry / providers: [`src/App.tsx`](src/App.tsx)
- Router: [`AppRouter.tsx`](AppRouter.tsx)
- Main page (note board): [`src/pages/Index.tsx`](src/pages/Index.tsx)
- 404 page: [`src/pages/NotFound.tsx`](src/pages/NotFound.tsx)
- Service worker: [`public/sw.js`](public/sw.js)
- Web manifest: [`public/manifest.json`](public/manifest.json)
- Package scripts and commands: [`package.json`](package.json)
- ESLint custom rules and docs: [`eslint-rules/require-webmanifest.js`](eslint-rules/require-webmanifest.js), [`eslint-rules/README.md`](eslint-rules/README.md)


## Features

- Post‑it style note board with drag & drop, edit, delete, and colors
- LocalStorage persistence and JSON export/import
- PWA support (manifest + service worker)
- shadcn/ui component library patterns (Radix primitives, Tailwind)
- Ready hooks and guidelines (see [AGENTS.md](AGENTS.md))
- Opinionated UX and accessibility patterns

### Theme System

The project includes a complete light/dark theme system using CSS custom properties. The theme can be controlled via:

- `useTheme` hook for programmatic theme switching
- CSS custom properties defined in `src/index.css`
- Automatic dark mode support with `.dark` class


## Technology

- **React 18.x**: Stable version of React with hooks, concurrent rendering, and improved performance
- **TailwindCSS 3.x**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **shadcn/ui**: Unstyled, accessible UI components built with Radix UI and Tailwind
- **React Router**: For client-side routing with BrowserRouter and ScrollToTop functionality
- **TanStack Query**: For data fetching, caching, and state management
- **TypeScript**: For type-safe JavaScript development


## Project Structure

- `/docs/`: Specialized documentation for implementation patterns and features
- `/src/components/`: UI components
  - `/src/components/ui/`: shadcn/ui components (48+ components available)
  - `/src/components/dm/`: Direct messaging UI components (DMMessagingInterface, DMConversationList, DMChatArea)
  - Zap components: `ZapButton`, `ZapDialog`, `WalletModal` for Lightning payments
- `/src/hooks/`: Custom hooks including:
  - `useAuthor`: Fetch user profile data by pubkey
  - `useCurrentUser`: Get currently logged-in user
  - `useUploadFile`: Upload files
  - `useAppContext`: Access global app configuration
  - `useTheme`: Theme management
  - `useToast`: Toast notifications
  - `useLocalStorage`: Persistent local storage
  - `useLoggedInAccounts`: Manage multiple accounts
  - `useIsMobile`: Responsive design helper
  - `useShakespeare`: AI chat completions with Shakespeare AI API
- `/src/pages/`: Page components used by React Router (Index, NotFound)
- `/src/lib/`: Utility functions and shared logic
- `/src/contexts/`: React context providers (AppContext, NWCContext, DMContext)
  - `useDMContext`: Hook exported from DMContext for direct messaging (NIP-04 & NIP-17)
  - `useConversationMessages`: Hook exported from DMContext for paginated messages
- `/src/test/`: Testing utilities including TestApp component
- `/public/`: Static assets
- `App.tsx`: Main app component with provider setup (**CRITICAL**: this file is **already configured** with `QueryClientProvider`, `UnheadProvider` and other important providers - **read this file before making changes**. Changes are usually not necessary unless adding new providers. Changing this file may break the application)
- `AppRouter.tsx`: React Router configuration


## Getting started (development)
1. Install dependencies and run dev server:
   npm run dev
2. Open: http://localhost:8080 — This is configured in [vite.config.ts](vite.config.ts).
3. Stop the dev server:
   - In the terminal where you ran `npm run dev`, press `Ctrl+C` to stop the process.
   - If the server was started in the background or the port is still in use, you can kill the process:
     - find the PID (e.g. `ps aux | grep npm` `lsof -i :8080`) and `kill <pid>`, or use `npx kill-port 8080`.
   - The `dev` script is defined in [package.json](package.json).


## Build & test
- Build for production:
  npm run build
- Run full validation (typecheck, lint, tests, build):
  npm run test
- Deploy (project has a deploy script):
  npm run deploy

## Project layout (high level)
- src/
  - App.tsx — app providers and head setup ([src/App.tsx](src/App.tsx))
  - AppRouter.tsx — routes and scroll-to-top behavior ([AppRouter.tsx](AppRouter.tsx))
  - main.tsx — bootstrap / service worker registration ([src/main.tsx](src/main.tsx))
  - pages/
    - Index.tsx — main note board page ([src/pages/Index.tsx](src/pages/Index.tsx))
    - NotFound.tsx — 404 page ([src/pages/NotFound.tsx](src/pages/NotFound.tsx))
  - components/ — UI components and dialogs (shadcn/ui primitives)
  - hooks/ — custom hooks (useToast, useLocalStorage, ...)
  - lib/ — utilities (e.g., `cn()` helper)
  - types/ — TypeScript types (e.g., [`src/types/note.ts`](src/types/note.ts))
- public/
  - manifest.json — PWA manifest ([public/manifest.json](public/manifest.json))
  - sw.js — service worker ([public/sw.js](public/sw.js))
- eslint-rules/ — project-specific ESLint rules and docs

## PWA notes
- A web manifest is included at [public/manifest.json](public/manifest.json) and linked from [index.html](index.html). The project includes a service worker at [public/sw.js](public/sw.js) that caches core assets.
- ESLint enforces manifest presence via a custom rule. See [`eslint-rules/require-webmanifest.js`](eslint-rules/require-webmanifest.js) and its documentation [`eslint-rules/README.md`](eslint-rules/README.md).

## Testing & validation
- The `test` script runs TypeScript type checks, ESLint, Vitest tests and a final build. Run:
  npm run test

## Contributing
- Follow coding good coding standards and best practices, use the `@/` path aliases configured in `tsconfig.json`, and avoid `any`. Ensure changes pass the project validation workflow before committing.

## Credits
Built with shadcn/ui templates and community libs — for credits see repo history.

## License
MIT license