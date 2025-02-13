## Blog Post Creation

To create a new blog post, you can use the interactive CLI:

```bash
pnpm create-post
```

This will prompt you for:

- Post slug (e.g., my-first-post)
- Title
- Description
- Tags (comma-separated)

You can also provide these arguments directly:

```bash
pnpm create-post my-first-post "My First Post" "A description" tag1 tag2
```

## Blog Post Management

### Moving Posts to Trash

Instead of permanent deletion, posts are moved to a trash folder:

```bash
pnpm delete-post
```

This will:

1. Show a list of existing posts
2. Let you select which post to move to trash
3. Ask for confirmation

You can also specify the post slug directly:

```bash
pnpm delete-post my-first-post
```

### Restoring Posts from Trash

To restore a post from the trash:

```bash
pnpm restore-post
```

This will:

1. Show a list of posts in the trash with deletion dates
2. Let you select which post to restore
3. Move the post back to the blog folder

### Emptying the Trash

To permanently delete all posts in the trash:

```bash
pnpm empty-trash
```

This will:

1. Show all posts currently in the trash
2. Ask for confirmation
3. Require typing "DELETE" to confirm
4. Permanently delete all trashed posts

## Draft System

The blog supports a draft system for working on posts before publishing them.

### Creating Drafts

To create a new draft:

```bash
pnpm draft-post
```

This will prompt you for:

- Draft title
- Description
- Tags

You can also provide the title directly:

```bash
pnpm draft-post "My Draft Post"
```

Drafts are stored in `content/_drafts/` with a `.draft.md` extension.

### Managing Drafts

List all drafts:

```bash
pnpm list-drafts
```

This shows:

- Draft title
- Description
- Last edited date
- Slug

Update a draft:

```bash
pnpm update-draft
```

This will:

1. Show a list of available drafts
2. Let you select which draft to update
3. Prompt for new title, description, and tags
4. Keep existing values if left empty

You can also specify the draft slug directly:

```bash
pnpm update-draft my-draft-post
```

Delete a draft:

```bash
pnpm delete-draft
```

This will:

1. Show a list of available drafts
2. Let you select which draft to delete
3. Ask for confirmation
4. Permanently delete the draft

You can also specify the draft slug directly:

```bash
pnpm delete-draft my-draft-post
```

### Publishing Drafts

When your draft is ready:

```bash
pnpm publish-draft
```

This will:

1. Show a list of available drafts
2. Let you select which draft to publish
3. Move it to the blog folder

You can also specify the draft slug directly:

```bash
pnpm publish-draft my-draft-post
```

### Converting Posts to Drafts

To convert a published post back to a draft:

```bash
pnpm unpublish-post
```

This will:

1. Show a list of published posts
2. Let you select which post to convert
3. Move it to the drafts folder

You can also specify the post slug directly:

```bash
pnpm unpublish-post my-published-post
```

## Managing Published Posts

### Updating Posts

To update a published post:

```bash
pnpm update-post
```

This will:

1. Show a list of published posts
2. Let you select which post to update
3. Prompt for new title, description, and tags
4. Open your editor to update content
5. Keep existing values if left empty

You can also specify the post slug directly:

```bash
pnpm update-post my-published-post
```
