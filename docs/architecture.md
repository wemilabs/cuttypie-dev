# Website Architecture Documentation

This document provides a comprehensive visual guide to our Next.js website's architecture using Mermaid diagrams.

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Blog System Flow](#blog-system-flow)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow-for-blog-posts)
5. [Directory Structure](#directory-structure)

## Core Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js App Router)"]
        direction TB
        Pages["Pages (app/*)"]
        Components["Components"]
        Styles["Styles (Tailwind)"]
    end

    subgraph Backend["Backend (Server Components)"]
        direction TB
        API["API Routes"]
        Utils["Utility Functions"]
        Actions["Server Actions"]
    end

    subgraph Data["Data Layer"]
        direction TB
        Content["Content (MD Files)"]
        Assets["Static Assets"]
        Config["Configuration"]
    end

    Data --> Backend
    Backend --> Frontend
```

## Blog System Flow

```mermaid
flowchart TB
    subgraph Content["Content Management"]
        MD["Markdown Files"]
        Assets["Images & Assets"]
    end

    subgraph Processing["Content Processing"]
        Parser["Markdown Parser"]
        Meta["Frontmatter"]
        Syntax["Syntax Highlighting"]
    end

    subgraph Rendering["Page Rendering"]
        List["Blog List Page"]
        Detail["Blog Detail Page"]
        Grid["Post Grid"]
    end

    CLI["CLI Tool (create-post)"] --> MD
    MD --> Parser
    Parser --> Meta
    Parser --> Syntax
    Meta --> List
    Meta --> Detail
    Syntax --> Detail
    List --> Grid
```

## Component Architecture

```mermaid
graph TB
    subgraph Pages["Pages"]
        Home["Home (/)"]
        Blog["Blog (/blog)"]
        About["About (/about)"]
        Post["Post (/blog/[slug])"]
    end

    subgraph Components["Reusable Components"]
        Header["Header"]
        Footer["Footer"]
        PostGrid["Post Grid"]
        PostItem["Post Item"]
        CodeBlock["Code Block"]
        CopyButton["Copy Button"]
    end

    subgraph Utils["Utilities"]
        BlogUtils["Blog Utils"]
        DateUtils["Date Utils"]
        CodeUtils["Code Utils"]
    end

    Blog --> PostGrid
    PostGrid --> PostItem
    Post --> CodeBlock
    CodeBlock --> CopyButton
    Utils --> Components
    Components --> Pages
```

## Data Flow for Blog Posts

```mermaid
sequenceDiagram
    participant User
    participant CLI as CLI Tool
    participant FS as File System
    participant Page as Blog Page
    participant Processor as Content Processor

    User->>CLI: Create new post
    CLI->>FS: Write .md file
    Page->>FS: Request posts
    FS->>Processor: Raw markdown
    Processor->>Processor: Parse frontmatter
    Processor->>Processor: Process markdown
    Processor->>Processor: Highlight code
    Processor->>Page: Formatted content
    Page->>User: Display post
```

## Directory Structure

```mermaid
graph TD
    Root["Root (/)"] --> App["app/*"]
    Root --> Components["components/"]
    Root --> Content["content/"]
    Root --> Lib["lib/"]
    Root --> Public["public/"]
    Root --> Scripts["scripts/"]
    Root --> Docs["docs/"]

    App --> Pages["pages/
        - home
        - blog
        - about"]

    Components --> UI["UI Components
        - Header
        - Footer
        - PostGrid
        - etc."]

    Content --> Blog["blog/
        - .md files"]

    Lib --> Utils["Utilities
        - blog.ts
        - utils.ts"]

    Scripts --> Tools["Tools
        - create-post.ts"]
        
    Docs --> Documentation["Documentation
        - architecture.md"]
```

## Implementation Details

The website follows a clean architecture where:

1. **Content Management**
   - Blog posts are stored as Markdown files
   - Each post has frontmatter metadata
   - Posts support syntax highlighting
   - CLI tool ensures consistent post creation

2. **Server Components**
   - Handle data processing and rendering
   - Process Markdown to HTML
   - Manage post metadata
   - Sort and filter posts

3. **Client Components**
   - Manage user interactions
   - Handle copy-to-clipboard functionality
   - Provide responsive layouts
   - Implement navigation

4. **Utilities**
   - Shared functions for common operations
   - Date formatting
   - File system operations
   - Type definitions

All code is written in TypeScript and follows functional programming principles for maintainability and type safety.
