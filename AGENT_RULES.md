# AGENT_RULES.md

# Project Constitution

These rules are mandatory and apply during the entire development process.

Breaking these rules is considered a bug.

---

# 1. Single Source of Truth

The backend documentation is the source of truth.

Never invent endpoints.
Never invent request bodies.
Never invent response objects.

If something is unclear, stop and ask instead of making assumptions.

---

# 2. UI Consistency

The entire application must follow one single design language.

Every page should look like it belongs to the same product.

Do not redesign pages individually.

Maintain consistency in:

* spacing
* typography
* border radius
* shadows
* colors
* animations
* transitions
* buttons
* cards
* forms
* tables
* dialogs
* dropdowns
* navigation
* loading states
* empty states
* error states

No page should feel visually different from another.

---

# 3. Design System

The project already has a design system.

Do not duplicate it.

Maintain it.

Store visual tokens only in their proper locations.

Examples include:

* Tailwind theme configuration
* Global CSS variables
* Shared theme/config files
* Font configuration

Never hardcode colors throughout the application.

Never hardcode spacing values repeatedly.

Never hardcode typography repeatedly.

Always use the existing design tokens.

If a new design token is required, extend the design system instead of bypassing it.

---

# 4. shadcn/ui

Do NOT recreate UI components.

Always use existing shadcn/ui components whenever possible.

Examples:

* Button
* Card
* Dialog
* Drawer
* Table
* Input
* Select
* Popover
* Dropdown
* Sheet
* Form
* Badge
* Alert
* Skeleton
* Tabs
* Accordion
* Toast

If the required component already exists inside the project:

Reuse it.

Do not rewrite it.

If it does not exist:

Install it using the official shadcn CLI.

If installation requires permission or confirmation:

Stop and ask the user before proceeding.

Never build a custom component that already exists inside shadcn.

---

# 5. Reusable Components

Avoid duplication.

If identical UI appears more than once:

Extract it into a reusable component.

Prefer composition over duplication.

---

# 6. API Layer

Never call fetch directly inside pages.

Create reusable API methods.

Keep all API logic centralized.

Keep request and response types strongly typed.

---

# 7. State Management

Separate:

* Server State
* Client State
* UI State

Avoid unnecessary global state.

Use server-state libraries where appropriate.

---

# 8. Type Safety

No unnecessary "any".

Use TypeScript properly.

Prefer inference.

Create reusable interfaces.

---

# 9. Folder Organization

Do not create random folders.

Follow the existing project structure.

Group related files together.

Keep components modular.

---

# 10. Performance

Avoid unnecessary renders.

Avoid duplicated API requests.

Lazy load where appropriate.

Use pagination.

Cache server data where appropriate.

---

# 11. Accessibility

Every form must be usable.

Every dialog must be keyboard accessible.

Buttons must have proper states.

Forms must expose validation.

Inputs should have labels.

---

# 12. Error Handling

Every API request must handle:

* loading
* success
* empty
* validation
* authentication
* authorization
* network failure
* unexpected server errors

---

# 13. Testing

Before considering a feature complete:

Verify that:

* API works
* UI renders correctly
* Loading states work
* Error states work
* Success states work
* Responsive layout works
* Navigation works

---

# 14. Final Principle

When making decisions, prioritize:

1. Correctness
2. Consistency
3. Reusability
4. Maintainability
5. Performance

Never sacrifice consistency for speed.
