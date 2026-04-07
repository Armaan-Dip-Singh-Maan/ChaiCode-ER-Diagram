# ChaiCode-ER-Diagram

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://er-diagram-viewer.vercel.app)

**Repository:** [github.com/Armaan-Dip-Singh-Maan/ChaiCode-ER-Diagram](https://github.com/Armaan-Dip-Singh-Maan/ChaiCode-ER-Diagram)

This repo contains **two interactive ER diagrams** in one app: use the top tabs to switch boards (or open `#thrift` / `#fitness` in the URL).

Built with React (`src/ERDiagram.jsx`, `src/FitnessCoachingERDiagram.jsx`). Run locally with `npm install` and `npm run dev`.

---

## Page 1 — Instagram Thrift & Handmade Store

Interactive ER diagram for an **Instagram Thrift & Handmade Store** database: nine entities, eight relationships, order management and product catalog layers.

### Screenshots (Thrift)

#### Order management layer

Customer, Order, Payment, OrderItem, and Shipping with relationships (places, has payment, contains, ships via).

![Order management layer](docs/images/01-order-management-layer.png)

#### Design notes and entity summary

Design rationale cards and the full entity summary table.

![Design notes and entity summary](docs/images/02-design-notes-and-entity-summary.png)

#### Product catalog layer

Product with ThriftedDetail, HandmadeDetail, and Inventory extensions.

![Product catalog layer](docs/images/03-product-catalog-layer.png)

---

## Page 2 — Online fitness coaching (ChaiCode assignment)

Interactive ER diagram for an **online fitness coaching platform** (not gym floor management): trainers onboard clients, sell plans, schedule consultations and live sessions, manage subscriptions and payments, and track progress through structured metrics, weekly check-ins, and separate coach notes.

### Assignment timeline (ChaiCode / evaluation)

| Milestone | Date & time (2026) |
| --- | --- |
| **Start** | Apr 6, 11:30 PM |
| **Due** | Apr 7, 1:00 PM |
| **Eval begins** | Apr 7, 1:30 PM |
| **Eval ends** | Apr 8, 12:29 PM |

### Business problem (summary)

A fitness influencer runs **online coaching**: some clients buy **long-term plans**, some only want **consultations**, some get **live sessions** while others receive **routines and diet guidance**. The database must support onboarding, **subscriptions**, **scheduled sessions**, **weekly check-ins**, **progress** (weight, measurements, reports), and **trainer notes**, with clear separation from core user identity.

### Design highlights

| Topic | How it is modeled |
| --- | --- |
| **Trainers vs clients** | `User` is the identity table; `Trainer` and `Client` each reference `user_id` (one profile each when applicable). |
| **Plans vs purchases** | `Plan` is the catalog (created by a trainer). `Subscription` is an **enrollment**: which `client_id`, which `plan_id`, **start/end dates**, **status**, and `assigned_trainer_id`. Many clients can enroll in the same plan over time; one client can have many subscriptions over time. |
| **Sessions vs check-ins** | `Session` = scheduled **calendar** events (consultation, live call, etc.), with optional `subscription_id`. `CheckIn` = **async** periodic client reports — different entity. |
| **Progress** | `ProgressEntry` holds metrics (`weight_kg`, `body_measurements` JSON, etc.), not merged into `User` / `Client`. |
| **Trainer feedback** | `TrainerNote` is separate from `CheckIn` and optional `subscription_id` for context. |
| **Workouts & diet** | Kept **abstract** on `Plan` (`plan_kind`, `workout_diet_abstract`) so the ER stays practical; detailed program tables can be added later without breaking core relationships. |
| **Payments** | `Payment` references `subscription_id` with **1:N** cardinality for renewals, partial payments, or refund rows. |

**Entities (10):** `User`, `Trainer`, `Client`, `Plan`, `Subscription`, `Payment`, `Session`, `CheckIn`, `ProgressEntry`, `TrainerNote`.

### Diagram assets

| Asset | Description |
| --- | --- |
| **Interactive app** | Primary deliverable — pan/zoom-friendly SVG entities with **PK** / **FK** labels and relationship cardinalities (Fitness tab). |
| **Static export** | Optional: add `docs/images/er-diagram-fitness-full.png` after `npm run build && npm run preview` and a screenshot if you want a PNG in-repo. |

### Submission checklist (course expectations)

- Single coherent board (this repo: interactive pages + optional PNG under `docs/images/`).
- Readable layout, labeled **PK** / **FK**, cardinalities on relationship lines.
- Trainers, clients, plans, subscriptions, sessions, check-ins, progress, payments, and separate trainer notes represented with sensible cardinalities.

---

## Deployment (Vercel)

| | |
| --- | --- |
| **Production URL** | [https://er-diagram-viewer.vercel.app](https://er-diagram-viewer.vercel.app) |
| **Hosting** | [Vercel](https://vercel.com) — connected to this repo; pushes to `main` trigger new deploys |

---

## License

Project structure and diagram content are provided for coursework / portfolio use.
