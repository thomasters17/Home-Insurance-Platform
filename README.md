This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Run unit test

To run the unit tests run `npm t`

### Run Playwright BDD tests

If you're running the app on something other than localhost:3000, you first need to amend the base URl in the `playwright.config.ts` file.

#### Install
If you're running them for the first time, run `npm run playwright:install`

#### Headless mode
To run the tests in headless mode run `npm run test:e2e`

#### UI mode
To run the tests in UI mode run `npm run test:e2e:ui`

## Tech Stack

### Core Framework
- **Next.js** - React framework with App Router for server-side rendering and routing
- **TypeScript** - Type safety and better developer experience
- **React** - UI component library

### Styling
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/ui** - Accessible, customisable component library built on Radix UI primitives

### Forms & Validation
- **React Hook Form** - Performant form state management with minimal re-renders
- **Zod** - TypeScript-first schema validation for runtime type checking
- **@hookform/resolvers** - Connects Zod schemas to React Hook Form

### Testing
- **Vitest** - Fast unit testing framework with Jest-compatible API
- **Playwright** - End-to-end testing for critical user flows

### Development Tools
- **ESLint** - Code linting for consistency
- **Prettier** - Code formatting