---
title: Next.js Server Actions Guide
description: Learn how to use Server Actions in Next.js 14
tags:
  - nextjs
  - react
  - server-actions
date: "2025-02-12T08:23:45.123Z"
---

Server Actions are a powerful feature in Next.js 14 that allows you to run server-side code directly from your components. Let's explore how to use them effectively!

## Basic Server Action

Here's a simple example of a Server Action:

```typescript
"use server";

async function addTodo(formData: FormData) {
  const todo = formData.get("todo");
  await db.todos.create({ data: { text: todo } });
}
```

## Using with Client Components

You can use Server Actions in your client components:

```tsx
"use client";

export default function TodoForm() {
  return (
    <form action={addTodo}>
      <input name="todo" type="text" required />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

## With Loading States

Here's how to handle loading states:

```tsx
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Todo"}
    </button>
  );
}
```

## Error Handling

Proper error handling is crucial:

```typescript
"use server";

import { revalidatePath } from "next/cache";

async function addTodo(formData: FormData) {
  try {
    const todo = formData.get("todo");
    await db.todos.create({ data: { text: todo } });
    revalidatePath("/todos");
  } catch (error) {
    throw new Error("Failed to create todo");
  }
}
```

## Best Practices

1. Always use the `'use server'` directive at the top of files containing Server Actions
2. Validate input data before processing
3. Handle errors gracefully
4. Use revalidation when data changes
5. Consider optimistic updates for better UX

Server Actions make it easy to build interactive applications while keeping sensitive operations on the server. They're perfect for forms, data mutations, and any operation that needs server-side processing.
