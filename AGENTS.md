## Package Manager

This project uses pnpm as the package manager. if need to install a new package, use the following command:

```bash
pnpm add <package-name>
```

## Shadcn UI Instructions

Use the latest version of Shadcn to install new components, like this command to add a button component:

```bash
pnpx shadcn@latest add button
```

## Code Style

### Import Statement Guidelines

**Always use explicit named imports instead of namespace imports (`import * as`).**

❌ **Avoid:**
```typescript
import * as React from "react";
import * as Utils from "./utils";
import type * as React from "react";
```

✅ **Prefer:**
```typescript
import { useState, useEffect } from "react";
import { formatDate, parseJSON } from "./utils";
import type { ComponentProps, ReactNode } from "react";
```

**Rationale:**
- **Better tree-shaking**: Bundlers can eliminate unused exports more effectively
- **Clearer dependencies**: Explicitly shows which functions/types are being used
- **Improved readability**: Makes it easier to understand what's being imported
- **Better IDE support**: Enables more accurate auto-completion and refactoring

**Note:** This rule applies to all imports, including type imports. Always import specific types rather than using `import type * as`.

### Layout and styles

1. General Principles

* Single Codebase Reuse: Share the same HTML/CSS/JS codebase between desktop and mobile. Use media queries and component-based design for automatic adaptation. Prohibit maintaining separate mobile codebases, unless involving native integrations (e.g., PWA with App bridging).
* Mobile-First Approach: Start designing baseline styles for the smallest screens (320px), then progressively enhance for desktop. Avoid desktop-first issues like style overrides.
* Consistency and Accessibility: Maintain core interactions (e.g., code editing, AI chat) unchanged during layout shifts. Ensure WCAG 2.1 AA compliance (e.g., visible focus, touch-friendly).

2. Breakpoint Definitions
Use the following standard breakpoints (based on common device widths) in CSS media queries:

* Mobile: ≤ 480px (baseline, single-column layout)
* Tablet: 481px - 768px (dual-column or collapsible sidebar)
* Desktop: ≥ 769px (multi-column, full toolbar)