# elf-components

Shared UI patterns and reusable components for ELF (Evolu Local-First) applications.

## What is this?

This repo provides common UI building blocks used across local-first apps built with the same stack:

- [Elements (eme)](https://github.com/jhayashi/eme) - Privacy focused local first planner.
- [BlazeMarks](https://github.com/jhayashi/blazemarks) - Bookmark manager

## Stack

- **Next.js 15** / **React 19** / **TypeScript 5** (strict)
- **StyleX** - Zero-runtime CSS-in-JS
- **React Native Web** - Cross-platform UI primitives
- **Evolu** - Local-first database with encrypted CRDT sync
- **Bun** - Package manager and runtime

## Patterns

### Theming

A shared theming system based on the Zed editor theme format. Supports light/dark mode, bundled themes (Catppuccin, Flexoki, GitHub, One, Smooth), custom theme uploads, and persistence via localStorage.

Design tokens (fluid typography, responsive spacing, shadows) are defined as StyleX variables and driven by CSS custom properties set from the active theme.

### Settings

A two-tier settings pattern:

- **Device-local** (localStorage) - UI preferences like theme, locale, search provider
- **Synced** (Evolu table) - Shared preferences that follow the user across devices

### Auth / Identity

Local-first identity via Evolu's mnemonic-based system. No traditional login - data lives on-device with optional encrypted sync. Sync can be toggled on or off per device.
