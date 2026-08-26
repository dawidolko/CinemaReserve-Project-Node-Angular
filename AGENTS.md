# AGENTS.md

Guide for agents working on CinemaReserve. Add a section per area as conventions
emerge — do not pad sections with content that is not established yet.

## What this project is

A cinema seat reservation platform: Angular 19 standalone components on the
frontend, Node/Express with Sequelize on the backend, MySQL for persistence and
Nginx in front, all orchestrated with Docker Compose.

Read [README.md](README.md) first — it documents the architecture and the
commands used day to day.

## Language

**UI copy and code comments are English.** Labels, buttons, validation messages,
page titles, empty states and error text are all English. User-supplied data is
rendered exactly as entered and never normalised.

## Comments

Comments explain **why**, not what. The code already says what it does.

- Use multi-line block comments for anything that needs explaining; avoid
  trailing one-line comments tacked onto the end of a statement.
- A comment that restates the code is deleted rather than reworded.
- Document the constraint, the trade-off or the failure mode that made the code
  look the way it does — that is the part a reader cannot recover from the code.

## Accessibility

Non-negotiable, and cheap if you keep to the existing components:

- Never remove the global `:focus-visible` outline.
- Decorative icons are `aria-hidden="true"`; a meaningful icon gets a
  visually-hidden text equivalent.
- One `<h1>` per page and no skipped heading levels.
- Every page has `<header>`, `<nav>`, `<main id="main-content">` and `<footer>`,
  with a skip link as the first focusable element.
- Every form control has an associated label; errors use `role="alert"`.
- Honour `prefers-reduced-motion`.

## Docker

The container stack is the supported way to run this project end to end. Keep
`README.md` and the compose file in step: if you add a service, an environment
variable or a port, document it in the same commit.

## Reservations

Seat booking is the part that must not regress. A reservation writes one row per
seat, and a seat that is already taken for a screening can never be booked
twice — check availability inside the same transaction that writes the rows,
never before it.

## Before finishing

- [ ] The stack boots: `docker compose -f .tools/docker/docker-compose.yml up --build`.
- [ ] Seeding produces a usable database (movies, halls, screenings, users).
- [ ] No secrets committed.
- [ ] Copy is English.
