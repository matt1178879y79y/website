# Project Transfer Guide

## Essential Files to Copy to New Conversation

### 1. Package.json (Dependencies)
```json
{
  "name": "idforge-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.2.2",
    "tailwindcss": "3.3.3",
    "lucide-react": "^0.446.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-checkbox": "^1.1.1",
    "sonner": "^1.5.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  }
}
```

### 2. Key Configuration Files
- `next.config.js`
- `tailwind.config.ts` 
- `tsconfig.json`

### 3. Main App Files
- `app/layout.tsx`
- `app/page.tsx` (homepage)
- `app/order/page.tsx` (order form)
- `app/cart/page.tsx` (shopping cart)
- `app/checkout/page.tsx` (checkout with payment)

### 4. Context Files
- `contexts/CartContext.tsx`
- `contexts/AuthContext.tsx`

### 5. Component Files
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

## Quick Setup Instructions

1. Create new Next.js project:
```bash
npx create-next-app@latest idforge --typescript --tailwind --eslint
```

2. Install additional dependencies:
```bash
npm install lucide-react @radix-ui/react-select @radix-ui/react-checkbox sonner clsx tailwind-merge
```

3. Copy the files above
4. Run: `npm run dev`

## Current Features Implemented
✅ ID ordering form with pricing ($100 Regular, $175 Polycard, $195 NY v4)
✅ Small order upcharges (2x for <3 IDs, 1.5x for <6 IDs)
✅ Payment methods (Bitcoin 18% discount, Venmo 5% fee)
✅ Shopping cart without product images
✅ Complete checkout flow
✅ Authentication system
✅ Responsive design