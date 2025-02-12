---
title: TypeScript Tips and Tricks
description: Essential TypeScript tips for modern web development
tags:
  - typescript
  - tips
  - development
date: "2025-02-12T08:12:10.691Z"
---

Here are some essential TypeScript tips that will help you write better code!

## 1. Use Type Inference

TypeScript is smart enough to infer types in many cases:

```typescript
// Let TypeScript infer the type
const numbers = [1, 2, 3]; // Type: number[]
const user = {
  name: "John",
  age: 30,
}; // Type: { name: string; age: number }
```

## 2. Strict Mode is Your Friend

Always enable strict mode in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 3. Use Type Aliases and Interfaces

Keep your code DRY with type aliases and interfaces:

```typescript
type UserRole = "admin" | "user" | "guest";

interface User {
  id: number;
  name: string;
  role: UserRole;
}
```
