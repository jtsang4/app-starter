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