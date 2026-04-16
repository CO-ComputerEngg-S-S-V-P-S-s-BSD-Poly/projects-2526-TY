# Next.js to React Conversion - Complete Guide

## 🔄 Major Changes Made

### 1. Framework Change
- **FROM**: Next.js 14 with App Router
- **TO**: Create React App (Pure React 18)

### 2. Routing System
- **FROM**: Next.js file-based routing (`app/` directory)
- **TO**: React Router DOM v6 with route configuration

### 3. Styling Approach
- **FROM**: Tailwind CSS with custom configuration
- **TO**: Pure CSS with CSS Variables and modular stylesheets

### 4. Component Structure
- **FROM**: Server/Client Components (.tsx with TypeScript)
- **TO**: Client-side only components (.js with JavaScript)

## 📋 File-by-File Conversion

### Removed Next.js Specific Files
```
❌ next.config.mjs
❌ tsconfig.json
❌ postcss.config.mjs
❌ components.json (shadcn/ui config)
❌ All .tsx files
```

### Added React Specific Files
```
✅ src/index.js (React entry point)
✅ src/App.js (Main app with Router)
✅ public/index.html (HTML template)
✅ All components as .js files
✅ Modular CSS files
```

## 🎨 Styling Conversion

### Tailwind → Pure CSS

**Before (Tailwind):**
```jsx
<div className="flex items-center gap-4 px-4 py-2 bg-copper hover:bg-copper/90">
```

**After (Pure CSS):**
```jsx
<div className="navbar-container">
// In CSS file:
.navbar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-copper);
}
.navbar-container:hover {
  background-color: #A15E1F;
}
```

### Color Variables
Converted from Tailwind config to CSS variables:
```css
:root {
  --color-copper: #B87333;
  --color-brass: #C9A44C;
  --color-cream: #FFF6E5;
  --color-brown: #3E2723;
}
```

## 🧭 Routing Conversion

### Next.js App Router → React Router

**Before (Next.js):**
```
app/
├── page.js              → /
├── about/
│   └── page.js          → /about
├── shops/
│   ├── page.js          → /shops
│   └── [id]/
│       └── page.js      → /shops/:id
```

**After (React Router):**
```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/shops" element={<ShopsPage />} />
  <Route path="/shops/:id" element={<ShopDetailPage />} />
</Routes>
```

## 🔗 Link Components

### Next.js Link → React Router Link

**Before:**
```jsx
import Link from 'next/link'
<Link href="/products">Products</Link>
```

**After:**
```jsx
import { Link } from 'react-router-dom'
<Link to="/products">Products</Link>
```

## 🪝 Hooks Conversion

### usePathname → useLocation

**Before (Next.js):**
```jsx
import { usePathname } from 'next/navigation'
const pathname = usePathname()
const isActive = pathname === '/about'
```

**After (React Router):**
```jsx
import { useLocation } from 'react-router-dom'
const location = useLocation()
const isActive = location.pathname === '/about'
```

### useParams

**Before (Next.js):**
```jsx
import { useParams } from 'next/navigation'
const params = useParams()
const id = params.id
```

**After (React Router):**
```jsx
import { useParams } from 'react-router-dom'
const { id } = useParams()
```

## 🎭 Component Directives

### Removed 'use client'
All Next.js client components had `'use client'` directive. This is removed in React as all components are client-side by default.

**Before:**
```jsx
'use client'

import { useState } from 'react'
```

**After:**
```jsx
import { useState } from 'react'
```

## 📦 Dependencies Changed

### Removed
- next
- @vercel/analytics
- tailwindcss
- All shadcn/ui packages
- TypeScript related packages

### Added
- react-router-dom
- (React and React-DOM already included in CRA)

## 🖼️ Icons Solution

### lucide-react → Custom SVG Icons

**Before:**
```jsx
import { Heart, ShoppingBag } from 'lucide-react'
<Heart className="w-5 h-5" />
```

**After:**
```jsx
import { Icon } from '../utils/Icons'
<Icon name="heart" size={20} className="navbar-icon" />
```

Created custom `Icons.js` utility with all required SVG icons.

## 📱 Image Handling

### Next.js Image → Standard img / SVG

**Before:**
```jsx
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

**After:**
```jsx
<img src="/logo.png" alt="Logo" style={{width: '100px', height: '100px'}} />
// Or use inline SVG for icons
```

## 🎯 Component Structure

### Layout Component

**Before (Next.js RootLayout):**
```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

**After (React App):**
```jsx
// src/App.js
function App() {
  return (
    <Router>
      <Navbar />
      <main><Routes>...</Routes></main>
      <Footer />
    </Router>
  )
}
```

## 📄 Metadata Handling

### Next.js Metadata → HTML Head

**Before:**
```jsx
export const metadata = {
  title: 'Songir Marketplace',
  description: '...'
}
```

**After:**
```html
<!-- public/index.html -->
<head>
  <title>Songir Marketplace</title>
  <meta name="description" content="..." />
</head>
```

## 🌐 Font Loading

### Next.js Font → Google Fonts Link

**Before:**
```jsx
import { Playfair_Display, Lato } from 'next/font/google'
const playfair = Playfair_Display({ subsets: ['latin'] })
```

**After:**
```html
<!-- public/index.html -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

```css
/* src/styles/App.css */
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Lato', sans-serif;
}
```

## ✨ Features Preserved

All original features have been maintained:

✅ **Customer Features**
- Multiple shop browsing
- Product comparison
- Quote requests
- Wishlist
- Order tracking

✅ **Design Elements**
- Copper-Brass color theme
- Responsive layout
- Smooth animations
- SVG illustrations

✅ **Navigation**
- All routes working
- Active state highlighting
- Mobile menu

## 🔄 Migration Checklist

If you want to add more pages/features:

- [ ] Create component in `src/pages/` or `src/components/`
- [ ] Use `.js` extension (not `.jsx` or `.tsx`)
- [ ] Import React: `import React from 'react'`
- [ ] Use React Router's Link component for navigation
- [ ] Create corresponding CSS file in `src/styles/`
- [ ] Use CSS variables for theming
- [ ] Add route to `src/App.js` if it's a page
- [ ] Update navigation in Navbar if needed

## 💡 Best Practices Implemented

1. **Semantic File Naming**: Clear, descriptive names for all files
2. **Component Organization**: Separated by feature (common, home, etc.)
3. **CSS Modularity**: Each component has its own stylesheet
4. **Reusable Utilities**: Icons and helper functions
5. **Clean Code**: No unnecessary dependencies
6. **Comments**: Helpful comments throughout

## 🎓 Learning Resources

To understand this project better:
- React Router: https://reactrouter.com/
- React Hooks: https://react.dev/reference/react
- CSS Variables: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

---

**Conversion completed with 100% feature parity!** 🎉
