# Contributing to JSON Crack

Thank you for wanting to contribute! This is a community-driven project, and we appreciate your help. Please read this guide carefully to make the review process smooth and fast.

**Read our [Code of Conduct](./CODE_OF_CONDUCT.md) first** — we want to keep this community friendly and welcoming.

---

## Before You Start: The Issue-First Workflow

**Always open or find an issue BEFORE you start coding.** This saves everyone time.

1. **Check existing issues** — Search to see if someone already reported this or is working on it
2. **Open a new issue** if one doesn't exist — Describe what you want to fix or build
3. **Wait for approval** — I'll review and give feedback (usually within a few days)
4. **Once approved**, you can start coding
5. **Link your PR to the issue** — Use `Closes #123` in your PR description

This workflow prevents duplicate work and ensures your contribution aligns with the project's direction.

---

## Quick Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Tech Stack
JSON Crack uses:
- **React** — UI library
- **Reaflow** — Graph visualization
- **Mantine UI** — UI components
- **Zustand** — State management

### Get Started
```bash
# Clone the repo
git clone https://github.com/AykutSarac/jsoncrack.com.git
cd jsoncrack.com

# Install dependencies
pnpm install

# Run the dev server
pnpm dev
```

The app will be available at `http://localhost:3000`

---

## How to Submit a Pull Request

### Requirements
Before submitting, make sure your PR includes:

1. **Issue ID** — Reference the issue: `Closes #123`
2. **Clear description** — What does this change do? Why?
3. **Evidence of working changes** — One or both:
   - **Screenshot** — Show the UI before/after
   - **Video** — Screen recording of the feature in action
4. **Test it locally** — Run `pnpm dev` and verify it works
5. **Follow code style** — Use [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

### Creating Your Branch
```bash
git checkout -b fix/issue-123-description
# or
git checkout -b feature/issue-123-description
```

Use clear branch names that reference the issue.

---

## Guidelines

### Performance First
- Avoid unnecessary re-renders
- Use React DevTools Profiler to check performance
- Test with large JSON files to ensure no slowdowns

### Code Quality
- Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Write descriptive commit messages
- Keep changes focused — one feature/fix per PR

### Testing
- Manually test your changes thoroughly
- Describe exactly how you tested it in the PR
- Make sure existing features still work

---

## Example PR

Here's what a good PR looks like:

**Title:** Add JSON validation tooltip on parse error

**Description:**
```
Closes #234

## What Changed
Added a helpful tooltip that shows validation errors when JSON fails to parse, making it easier for users to fix their JSON.

## How to Test
1. Paste invalid JSON: `{invalid`
2. Look for the red error indicator
3. Hover over it to see the detailed error message

## Evidence
- [Screenshot of tooltip](link-to-image)

## Performance Notes
No performance impact. Tooltip renders conditionally only on errors.
```

---

## Questions?

- Found a bug? Open an issue
- Have an idea? Open an issue
- Confused about something? Comment on the issue

Thank you for contributing to JSON Crack! 🎉
