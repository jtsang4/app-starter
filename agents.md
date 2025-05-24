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
