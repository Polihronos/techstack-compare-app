# TechStack Compare - Testing Guide

## Overview
TechStack Compare is a web application that allows developers to compare different technology stacks by writing, running, and previewing code in real-time across multiple frameworks.

## Supported Frameworks

### ✅ Fully Working Frameworks:

1. **Vanilla JavaScript**
   - Runs directly in the browser
   - No compilation needed
   - Badge shows: Yellow "Vanilla JS"

2. **React**
   - Uses CDN libraries (React 18 + Babel standalone)
   - Runs directly in browser
   - Badge shows: Blue "React"

3. **Vue 3**
   - Uses CDN library (Vue 3 global build)
   - Runs directly in browser
   - Badge shows: Green "Vue 3"

4. **Svelte**
   - Server-side compilation via Next.js API route (`/api/compile-svelte`)
   - Uses official Svelte compiler package
   - Badge shows: Orange "Svelte"

5. **Angular**
   - Browser-based execution with CDN libraries
   - Extracts template and class from standalone components
   - Badge shows: Red "Angular"

## How to Test

### 1. Start the Development Server
The server should already be running. If not:
```bash
npm run dev
```

Navigate to `http://localhost:3000`

### 2. Test Each Framework

#### Testing Vanilla JavaScript:
1. Select "Vanilla JS" from the dropdown
2. Default counter example loads automatically
3. Click "Run" button
4. You should see:
   - Yellow "Vanilla JS" badge in top-right of preview
   - Counter app with +, -, and Reset buttons
   - All buttons should work

#### Testing React:
1. Select "React" from the dropdown
2. Default counter example loads automatically
3. Click "Run" button
4. You should see:
   - Blue "React" badge in top-right of preview
   - Counter app with +, -, and Reset buttons
   - All buttons should work with React state

#### Testing Vue 3:
1. Select "Vue 3" from the dropdown
2. Default counter example loads automatically
3. Click "Run" button
4. You should see:
   - Green "Vue 3" badge in top-right of preview
   - Counter app with +, -, and Reset buttons
   - All buttons should work with Vue reactivity

#### Testing Svelte:
1. Select "Svelte" from the dropdown
2. Default counter example loads automatically
3. Click "Run" button (you'll see "Running..." spinner briefly)
4. The code is sent to `/api/compile-svelte` for compilation
5. You should see:
   - Orange "Svelte" badge in top-right of preview
   - Counter app with +, -, and Reset buttons
   - All buttons should work with Svelte reactivity

#### Testing Angular:
1. Select "Angular" from the dropdown
2. Default counter example loads automatically
3. Click "Run" button (you'll see "Running..." spinner briefly)
4. The code is sent to `/api/compile-angular` for processing
5. You should see:
   - Red "Angular" badge in top-right of preview
   - Counter app with +, -, and Reset buttons
   - All buttons should work with Angular change detection

## Visual Feedback Features

### Framework Badges
Each framework displays a colored badge in the top-right corner of the preview pane:
- **Vanilla JS**: Yellow (#eab308)
- **React**: Blue (#3b82f6)
- **Vue 3**: Green (#10b981)
- **Svelte**: Orange (#f97316)
- **Angular**: Red (#dc2626)

This badge confirms you're viewing the correct framework execution.

### Loading States
- Run button shows spinner and "Running..." text during execution
- Especially noticeable for Svelte and Angular (server compilation)

### Error Handling
- If compilation fails, an error banner appears at the top of the preview pane
- Errors are also logged to the browser console

## Architecture Details

### Client-Side Execution (Vanilla, React, Vue):
```
User Code → HTML Template with CDN scripts → iframe
```

### Server-Side Compilation (Svelte):
```
User Code → API Route (/api/compile-svelte) → Svelte Compiler → Compiled JS → iframe
```

### Hybrid Execution (Angular):
```
User Code → API Route (/api/compile-angular) → Extract Template + Class → HTML with Angular CDN → iframe
```

## Common Issues & Solutions

### Issue: Svelte doesn't run
- **Check**: API route at `/api/compile-svelte` exists
- **Check**: Svelte package is installed (`npm install svelte`)
- **Check**: Browser console for compilation errors

### Issue: Angular doesn't run
- **Check**: API route at `/api/compile-angular` exists
- **Check**: Angular packages are installed
- **Check**: Code follows the template format (decorator with template property)

### Issue: No badge showing
- **Check**: Code actually executed (click Run button)
- **Check**: iframe loaded properly (refresh page if needed)

### Issue: Counter doesn't work
- **Check**: Console for JavaScript errors
- **Check**: Framework is correctly initialized

## Next Steps

### To Add:
- [ ] Code conversion between frameworks using Claude API
- [ ] More example templates (todo app, fetch data, forms)
- [ ] Syntax highlighting for different languages
- [ ] Share/save functionality
- [ ] Better Angular compilation (full TypeScript support)

## File Structure
```
app/
├── page.tsx                    # Main UI component
├── utils/
│   ├── templates.ts           # Example code for each framework
│   └── executor.ts            # Execution logic for each framework
└── api/
    ├── compile-svelte/
    │   └── route.ts           # Svelte server-side compilation
    └── compile-angular/
        └── route.ts           # Angular processing
```

## Verification Checklist

- [ ] Vanilla JS counter works
- [ ] React counter works
- [ ] Vue 3 counter works
- [ ] Svelte counter works (with server compilation)
- [ ] Angular counter works (with server processing)
- [ ] All framework badges display correctly
- [ ] Error messages show when code fails
- [ ] Loading spinner appears during async operations
- [ ] Framework switching loads correct example code
