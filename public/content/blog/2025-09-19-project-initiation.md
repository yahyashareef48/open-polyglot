---
title: "Open Polyglot Project Initiation - Setting Up the Foundation"
date: "2025-09-19"
author: "Yahya Shareef"
excerpt: "Today marks the beginning of Open Polyglot's technical infrastructure setup. A comprehensive look at the initial deployment challenges and solutions we encountered while setting up subdomain routing for our multilingual learning platform."
tags: ["Project Initiation", "Next.js", "Cloud Run", "Subdomain Routing", "DevOps"]
---

# Open Polyglot: Project Initiation & Infrastructure Setup

**Project Initiation Date:** September 19, 2025
**Current Status:** Infrastructure Complete, Development Phase Starting
**Platform:** [openpolyglot.org](https://openpolyglot.org)

## Project Overview

Today we officially initiated the Open Polyglot project - an ambitious multilingual learning platform that will use subdomain routing to provide language-specific experiences. Users will access different languages through intuitive URLs like `german.openpolyglot.org` and `french.openpolyglot.org`.

## Initial Infrastructure Challenges

### Challenge: Subdomain Routing in Production
**Problem**: `german.openpolyglot.org` serving main page instead of German content
**Root Cause**: Cloud Run middleware receiving internal hostname instead of custom domain
```
Expected: hostname = "german.openpolyglot.org"
Actual: hostname = "t-199197406---open-polyglot-kvvz3ygpcq-uc.a.run.app"
```
**Solution**: Modified middleware to use `X-Forwarded-Host` header:
```typescript
const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
```

## Technical Foundation Established

### Architecture Components
- **Frontend**: Next.js 15.5.2 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **Deployment**: Google Cloud Run
- **Domain Management**: Custom domain mapping with wildcard support
- **Theme System**: Dark/light mode with next-themes

### Subdomain Routing System
```typescript
// Core middleware logic for language routing
const subdomain = hostname.split('.')[0];
const availableLanguages = ['german', 'french', 'spanish'];

if (!isMainDomain && url.pathname === '/') {
  if (availableLanguages.includes(subdomain)) {
    url.pathname = `/languages/${subdomain}`;
    return NextResponse.rewrite(url);
  }
}
```

### Development History (Past 3 Weeks)
Based on commit history analysis:
- **Initial Setup**: Next.js foundation and basic pages
- **Core Features**: Home page, language pages, theme system
- **Advanced Routing**: Subdomain support and 404 handling
- **Content System**: Blog functionality with markdown support
- **UI Polish**: Design updates and responsive layouts

## What's Next

### Immediate Development Goals
- **Content Creation**: Develop German language learning modules
- **Interactive Features**: Build vocabulary and grammar exercises
- **User Experience**: Enhance navigation and accessibility
- **Performance**: Optimize loading and rendering

### Technical Roadmap
- **Language Expansion**: Add French and Spanish content
- **User System**: Authentication and progress tracking
- **Mobile Optimization**: PWA capabilities
- **Analytics**: Learning progress and usage metrics

## Infrastructure Status: ✅ Complete

With today's work, we've successfully established:
- ✅ Subdomain routing working correctly
- ✅ Build and deployment pipeline
- ✅ Content management system ready
- ✅ Blog platform functional

## Ready for Development Phase

The technical foundation is now solid and ready for content development. Our subdomain routing system correctly handles `german.openpolyglot.org`, `french.openpolyglot.org`, and other language-specific URLs.

The real work begins now - creating engaging, effective language learning experiences that will help users achieve their polyglot goals.

---

*This marks Day 1 of active development. Follow our progress as we build Open Polyglot into a comprehensive language learning platform.*