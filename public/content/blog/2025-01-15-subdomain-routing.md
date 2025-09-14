---
title: "Subdomain Routing Implementation"
date: "2025-01-15"
tags: ["technical", "infrastructure", "domains"]
author: "Yahya Shareef"
excerpt: "Today I tackled the complex challenge of implementing subdomain routing for language-specific pages. Each language gets its own subdomain for better organization."
---

# Subdomain Routing Challenge 🔧

Today we implemented one of the most technically challenging features: subdomain routing for language-specific content. Each language now has its own subdomain!

## What We Implemented:

- ✅ **Middleware routing**: `german.openpolyglot.org` → German content
- ✅ **Dynamic domain detection**: Works in both development and production
- ✅ **Fallback handling**: Unknown subdomains show appropriate 404/unavailable pages
- ✅ **Navigation updates**: Header links work correctly across subdomains

## Technical Details:

### Middleware Logic
```javascript
// Detects subdomain and routes accordingly
const subdomain = hostname.split('.')[0];
if (availableLanguages.includes(subdomain)) {
  url.pathname = `/languages/${subdomain}`;
  return NextResponse.rewrite(url);
}
```

### Domain Mapping
- **Development**: `german.localhost:3000`
- **Production**: `german.openpolyglot.org`

## Challenges Faced:

### 1. Firebase Hosting Limitations
- Firebase doesn't support true wildcard domains
- Each subdomain needs individual verification
- SSL certificate conflicts between main domain and wildcard

### 2. DNS Configuration
- Wildcard CNAME records in GoDaddy
- TXT record verification for each subdomain
- Production vs development environment differences

### 3. Next.js Middleware Complexity
- Handling both localhost and production domains
- Preventing infinite redirect loops
- Maintaining consistent behavior across environments

## Current Status:

- 🟢 **Development**: Fully working with `*.localhost:3000`
- 🟡 **Production**: Working on domain verification process
- 🟢 **Navigation**: Cross-domain links functioning properly

## Next Steps:

- 🎯 Complete Firebase domain verification
- 🎯 Test all language subdomains in production
- 🎯 Monitor SSL certificate provisioning
- 🎯 Add subdomain redirects for SEO

This was a complex feature that required deep understanding of DNS, hosting platforms, and Next.js middleware. The foundation is now solid for our multi-language architecture! 🚀