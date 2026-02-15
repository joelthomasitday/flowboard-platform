# FlowBoard SaaS Architecture & Setup Guide

This document outlines the architectural blueprint for **FlowBoard**, a clean, scalable, production-ready Next.js 15 SaaS application.

## 1. Step-by-Step Project Setup

### Initial Setup Commands

Run the following commands in your terminal to initialize the project:

```bash
# 1. Initialize Next.js 15 App
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm

# During setup prompts:
# - Would you like to use TypeScript? Yes
# - Would you like to use ESLint? Yes
# - Would you like to use Tailwind CSS? Yes
# - Would you like to use `src/` directory? Yes
# - Would you like to use App Router? Yes
# - Would you like to customize the default import alias (@/*)? No

# 2. Install Additional Dependencies (Optional but recommended for SaaS)
npm install lucide-react clsx tailwind-merge
```

### Configuration Changes

**`tailwind.config.ts` Update:**
Ensure your content paths include all component locations.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Example: Slate 900
        secondary: "#64748B",
        accent: "#3B82F6",
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**`tsconfig.json` Check:**
Ensure `paths` are set correctly for `@/*` alias to point to `./src/*`.

## 2. & 3. Folder Structure & Explanation

We follow a modular structure that separates concerns while keeping related items close.

```
src/
├── app/                  # App Router: Route definitions & layouts
│   ├── (auth)/           # Route Group: Auth pages (login, register) - share layout
│   ├── (marketing)/      # Route Group: Landing pages - share specific layout
│   │   └── page.tsx      # Landing Page (/)
│   ├── dashboard/        # Dashboard specific routes
│   │   ├── layout.tsx    # Dashboard Layout (Sidebar + Navbar)
│   │   ├── page.tsx      # Main Dashboard View
│   │   └── projects/     # Projects feature
│   │       └── [id]/     # Dynamic Route: Project Details
│   ├── layout.tsx        # Root Layout (Providers, Global Font)
│   └── globals.css       # Global Styles
├── components/           # React Components
│   ├── ui/               # Primitive/Atomic Components (Button, Input, Card)
│   ├── layout/           # Structural Components (Navbar, Sidebar, Footer)
│   ├── sections/         # Large Page Sections (Hero, Features, DashboardGrid)
│   └── icons/            # Icon wrappers or custom SVGs
├── lib/                  # Utilities & Configuration
│   ├── utils.ts          # Helper functions (cn, formatters)
│   ├── constants.ts      # App-wide constants
│   └── db.ts             # (Future) Database client
├── styles/               # Additional styles (if not using Tailwind exclusively)
├── types/                # Global TypeScript definitions
│   └── index.d.ts
└── hooks/                # Custom React Hooks
    └── use-sidebar.tsx
```

### Detailed Breakdown

- **`src/app`**: Contains all pages and routing logic. We use **Route Groups** like `(marketing)` and `(auth)` to organize routes without affecting the URL structure.
- **`src/components/ui`**: Base components (Atoms). These are dumb components that just render props and styles (e.g., `Button.tsx`, `Card.tsx`).
- **`src/components/layout`**: Components that define the shell of the application (e.g., `Sidebar.tsx`, `Navbar.tsx`).
- **`src/components/sections`**: Complex compositions of UI components used to build pages (e.g., `HeroSection.tsx`).
- **`src/lib`**: Pure functions, constants, and shared logic. `utils.ts` usually contains the `cn` class merger.
- **`src/hooks`**: Custom hooks for encapsulated logic (e.g., managing sidebar state).

## 4. Best Practice Component Structures

### A. Root Layout (`src/app/layout.tsx`)

Keep it clean. Only global providers and fonts go here.

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowBoard",
  description: "Manage your projects with flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### B. Reusable Container (`src/components/ui/Container.tsx`)

Standardizes max-width and padding across the app.

```tsx
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
```

### C. Reusable Button (`src/components/ui/Button.tsx`)

Using `cva` (class-variance-authority) pattern is recommended, but here is a clean simpler version using `clsx` and `tailwind-merge`.

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      ghost: "hover:bg-slate-100 text-slate-700",
      outline: "border border-slate-200 hover:bg-slate-100 text-slate-900",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
```

### D. Sidebar Component (`src/components/layout/Sidebar.tsx`)

Scalable sidebar with active state handling.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderKanban, Settings } from "lucide-react"; // Assuming lucide-react is installed

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-slate-50/50 p-6 md:flex">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-indigo-600" />
        <span className="text-lg font-bold text-slate-900">FlowBoard</span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

## 5. Modern SaaS Best Practices

1.  **Component Colocation**: Keep components generic in `components/ui` but specific logic in `app/` if it's not reused.
2.  **Server Components by Default**: Fetch data in server components (Pages/Layouts). Pass data down to Client Components as props.
3.  **Layout Nesting**: Use `dashboard/layout.tsx` for the shell (Sidebar/Navbar) so it persists on navigation, avoiding re-renders.
4.  **Utility-First CSS**: Avoid `@apply` in CSS files. Use Tailwind classes directly in JSX for better tree-shaking and maintainability.
5.  **Strict Types**: Use a global `types` folder or colocated `types.ts` for shared interfaces (e.g., `Project`, `User`).

---

**Generated by Antigravity - Senior Next.js SaaS Architect**
