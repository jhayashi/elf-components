# elf-components

Shared UI patterns and reusable components for the ELF (Evolu Local-First) project family.

## Related Projects

- [eme](https://github.com/jhayashi/eme) - Elements: local-first calendar and notes app
- [blazemarks](https://github.com/jhayashi/blazemarks) - Local-first bookmark manager with browser extension

## Common Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Runtime | **Bun** | latest | Package manager and runtime |
| Framework | **Next.js** | 15 | Pages Router, React Strict Mode |
| UI | **React** | 19 | Concurrent features, automatic batching |
| Language | **TypeScript** | 5 | Strict mode (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`) |
| Styling | **StyleX** | 0.17 | Meta's zero-runtime CSS-in-JS (babel + postcss plugins) |
| Cross-platform | **React Native Web** | 0.21 | Primitives: `Pressable`, `View`, `Text`, `ScrollView` |
| Database | **Evolu** | 7-10 | Local-first SQLite with CRDT sync and E2E encryption |
| Date/Time | **Temporal Polyfill** | 0.2 | Modern date/time API |
| Drag & Drop | **@dnd-kit** | 6.3 | Sortable, drag-and-drop interactions |
| PWA | **next-pwa** | 5.6 | Service worker, offline support via Workbox |
| Linting | **ESLint** | 8 | next/core-web-vitals + @stylexjs/eslint-plugin |
| Formatting | **Prettier** | 3 | Consistent code style |
| CSS | **PostCSS** + **Autoprefixer** | | StyleX postcss-plugin + vendor prefixing |

## Architecture Patterns

### Theming

Both projects use the **Zed editor theme format**:

- Theme JSON files live in `lib/themes/`
- `applyZedTheme()` maps Zed theme tokens to CSS custom properties (`--text`, `--background`, `--border`, etc.)
- Theme selection persisted in `localStorage` (key: `{app}-theme`)
- Light/dark mode respects `prefers-color-scheme`
- Users can upload custom Zed theme files
- Bundled themes: Catppuccin, Flexoki, GitHub, One, Smooth, and app-specific defaults

### Design Tokens (StyleX)

Defined in `lib/Tokens.stylex.ts`:

- **Typography**: Fluid sizes using `clamp()` (step_-2 through step5, Utopia scale)
- **Spacing**: Responsive scale (xxxs through xxxl)
- **Colors**: CSS custom properties mapped from theme (`text`, `background`, `border`, `accent`, etc.)
- **Shadows**: Multi-level shadow system (shadow1-6, innerShadow0-4)
- **Transitions**: Color/background/outline at 0.15s ease
- **Constants**: `minimalHit: 44px` (Apple touch target guideline)
- **Fonts**: System font stack + monospace stack

Theme variants in `lib/Themes.ts` define `appSpacing` and `webSpacing` baselines.

### Database (Evolu)

- Schema defined in `lib/Db.ts` with branded types
- Queries in `lib/queries.ts`, mutations in `lib/mutations.ts`
- Soft deletes via `isDeleted: SqliteBoolean` for CRDT compatibility
- Local-only tables prefixed with `_` (device-specific, not synced)
- Synced tables use Evolu's encrypted sync
- Settings stored as an Evolu table row (theme, preferences)

### State & Context

Nested provider pattern in `components/Providers.tsx`:

1. `EvoluProvider` - database access
2. App-specific context providers (Now, Intl, UiState, Toast, etc.)

UI preferences stored in `localStorage`, shared data in Evolu.

### Component Architecture

- Built on **React Native Web** primitives (`View`, `Text`, `Pressable`)
- Styled with **StyleX** (type-safe, zero-runtime)
- `forwardRef` pattern for imperative access
- Compound component pattern for popovers, modals, dialogs

### Auth / Identity

- **No traditional auth** - local-first by default
- Evolu provides mnemonic-based device identity for cross-device sync
- Sync is optional and can be toggled on/off
- No server-side sessions or tokens

### Settings

- `localStorage` for device-local UI preferences (theme, locale, provider)
- Evolu `settings` table for synced preferences
- Consistent key naming: `{app-name}-{setting}`

## Project Structure Convention

```
components/       # Reusable React components
lib/              # Business logic, utilities, hooks
  hooks/          # Custom React hooks
  themes/         # Zed theme JSON files
  contexts/       # React context providers
  i18n/           # Internationalization (if applicable)
pages/            # Next.js page routes
  settings/       # Settings sub-pages
styles/           # Global CSS (globals.css)
types/            # TypeScript ambient declarations
public/           # Static assets, PWA manifest
```

## Build Configuration

- **Babel**: `babel.config.js` with next/babel preset + @stylexjs/babel-plugin
- **PostCSS**: `postcss.config.js` with @stylexjs/postcss-plugin (targets: components/, lib/, pages/) + autoprefixer
- **Next.js**: `next.config.js` with react-native-web webpack alias, transpilePackages
- **TypeScript**: `tsconfig.json` with strict mode, jsx: preserve, noEmit

## Development

```bash
bun install        # Install dependencies
bun run dev        # Start dev server
bun run build      # Production build
bun run lint       # ESLint check
bun run format     # Prettier format
```
