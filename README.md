
# noter m. (noter memo)

noter m. is a lightweight, digital note board built with React, TypeScript, TailwindCSS and shadcn/ui. It includes local persistence, export/import functionality and works as a fully Progressive Web App (PWA).

<img width="1098" height="550" alt="noter_m_preview" src="https://github.com/user-attachments/assets/486671df-db87-484e-81a6-d16108687c5f" />


## Features

- Post‑it style note board with drag & drop, edit, delete, and colors
- LocalStorage persistence and JSON export/import
- PWA support (manifest + service worker)
- shadcn/ui component library patterns (Radix primitives, Tailwind)
- Opinionated UX and accessibility patterns


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
  - `useAppContext`: Access global app configuration
  - `useTheme`: Theme management
  - `useToast`: Toast notifications
  - `useLocalStorage`: Persistent local storage
  - `useIsMobile`: Responsive design helper
- `/src/pages/`: Page components used by React Router (Index, NotFound)
- `/src/lib/`: Utility functions and shared logic
- `/src/test/`: Testing utilities including TestApp component
- `/public/`: Static assets
- `App.tsx`: Main app component with provider setup (**CRITICAL**: this file is **already configured** with `UnheadProvider` - Changes are usually not necessary unless adding new providers. Changing this file may break the application)
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


## PWA notes

- A web manifest is included at [public/manifest.json](public/manifest.json) and linked from [index.html](index.html). The project includes a service worker at [public/sw.js](public/sw.js) that caches core assets.
- ESLint enforces manifest presence via a custom rule. See [`eslint-rules/require-webmanifest.js`](eslint-rules/require-webmanifest.js) and its documentation [`eslint-rules/README.md`](eslint-rules/README.md).


## Testing & validation

- The `test` script runs TypeScript type checks, ESLint, Vitest tests and a final build.

  - Run full validation (typecheck, lint, tests, build):
  npm run test

  - Run specific test file:
  npx vitest run src/test/pages/index.test.tsx


## Building and Deployment

When deploying new changes:

1. **Update service worker cache version** in [public/sw.js](public/sw.js):
   ```javascript
   const CACHE_NAME = 'noter-m-v1';
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Run QA / test version**:
   ```bash
  npm run preview
   ```

4. **Deploy** the `dist` folder to your hosting service:
   ```bash
   npm run deploy
   ```

### Why update CACHE_VERSION?

The service worker caches assets for offline use. When you increment `CACHE_VERSION`:
- Old caches are automatically deleted
- Users get the latest version of your app
- Prevents the issue where refreshing shows old content after server restart


## Contributing

- Follow coding good coding standards and best practices, use the `@/` path aliases configured in `tsconfig.json`, and avoid `any`. Ensure changes pass the project validation workflow before committing.


## Credits

See repo history.


## License

MIT license
