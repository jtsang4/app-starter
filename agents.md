# Agents.md

This document outlines the coding conventions and preferences used in this project.

## TypeScript

- When importing types in TypeScript, use the format 'import { type A, B } from ...' for mixed imports or 'import type { A, C } from ...' when importing only types.
- User prefers using tsx instead of ts-node if they serve the same purpose to avoid duplicate dependencies.

# React Conventions

- When using React, import specific members explicitly (e.g., import { useState } from 'react') rather than using React.useState, and use 'import type' for importing types.
- User prefers Ant Design's App.useApp() hook directly in components rather than creating a centralized provider for static methods.
- User prefers using direct type imports from source files rather than using ReturnType<typeof> utility type to avoid repetition in type definitions.
- When using Ant Design Form, avoid setting the same field value both in Form's initialValues prop and in individual Form.Item components to prevent 'Field can not overwrite it' errors.
- User prefers explicit exports over 'export \*' syntax and wants all code to follow this pattern.
- User prefers using Tailwind CSS class names instead of inline styles in TSX files when possible, except for cases where style attributes are necessary for overriding Ant Design component styles. User prefers replacing inline styles with Tailwind CSS classes throughout the project where appropriate, especially for standard HTML elements.

## TailwindCSS Guidelines

**This project uses TailwindCSS 4.0** - Configuration and usage are significantly different from version 3. When implementing TailwindCSS features or configurations, always verify against TailwindCSS 4 documentation first.

### Key TailwindCSS 4 Differences from v3:

- **CSS-first configuration**: Use `@theme` directive in CSS instead of `tailwind.config.js`
- **Import syntax**: Use `@import "tailwindcss"` instead of `@tailwind` directives
- **Native CSS variables**: All theme values are available as CSS variables (e.g., `var(--color-blue-500)`)
- **Simplified installation**: Fewer dependencies, zero configuration required
- **Automatic content detection**: No need to configure content paths manually
- **Built-in import support**: No need for additional PostCSS plugins
- **Modern CSS features**: Uses cascade layers, `@property`, `color-mix()`, and logical properties
- **Performance improvements**: Up to 5x faster builds and 100x faster incremental rebuilds

### Important Breaking Changes:

- Utility renames: `shadow-sm` → `shadow-xs`, `shadow` → `shadow-sm`, `rounded-sm` → `rounded-xs`, etc.
- `outline-none` → `outline-hidden` (new `outline-none` actually sets `outline-style: none`)
- Default `ring` width changed from 3px to 1px (use `ring-3` for old behavior)
- Gradient utilities: `bg-gradient-*` → `bg-linear-*`
- Default border and ring colors changed to `currentColor`
- Variant stacking order changed from right-to-left to left-to-right

### When Uncertain:

- Always check the official TailwindCSS 4 documentation at https://tailwindcss.com/docs or use Context7 tool
- Use the upgrade guide at https://tailwindcss.com/docs/upgrade-guide for migration references
- Verify utility names and syntax against v4 documentation before implementation

# Authentication and Session Management

- Replace mock user IDs with real user authentication using better-auth.com's approach, particularly in Next.js context.
- Don't use mock user IDs in the code; instead directly obtain the real user ID from the authentication system.
