# 🐉 Life RPG: System Architecture & Specification

> **Vision:** Turn real-world habits into a persistent character-progression game. The app must feel like a game first—with instant feedback, juicy animations, and zero perceptible network lag—powered by a robust, secure full-stack architecture.

## 🏗️ 1. High-Level System Architecture

The system relies on a **Server-Authoritative Game Loop**. The frontend provides an optimistic UI for game feel, but the backend acts as the single source of truth to prevent cheating.

```mermaid
graph TD
    %% Define Styles
    classDef frontend fill:#3178c6,stroke:#fff,stroke-width:2px,color:#fff,rx:5px,ry:5px;
    classDef backend fill:#3c873a,stroke:#fff,stroke-width:2px,color:#fff,rx:5px,ry:5px;
    classDef db fill:#336791,stroke:#fff,stroke-width:2px,color:#fff,rx:5px,ry:5px;

    subgraph Client [Frontend SPA - React / Vite]
        UI[React Components\nTailwind + Framer Motion]
        Cache[State Management\nReact Query / Zustand]
        Optimistic[Optimistic UI Engine]
    end

    subgraph Server [Backend REST API - Node.js / Express]
        API[API Router]
        Auth[JWT Auth Layer]
        GameEngine[Game Logic Engine\nXP, Streaks, Economy]
        ORM[Prisma ORM]
    end

    subgraph Database [Relational DB]
        PG[(PostgreSQL)]
    end

    User((User)) -->|Interacts| UI
    UI <--> Cache
    Cache -->|Predicts UI| Optimistic
    UI -- "HTTPS / JWT\n(REST)" --> API
    API <--> Auth
    API <--> GameEngine
    GameEngine <--> ORM
    ORM -- "TCP/IP" --> PG
    
    class UI,Cache,Optimistic frontend;
    class API,Auth,GameEngine,ORM backend;
    class PG db;
```

## 🗄️ 2. Database Entity-Relationship (ER) Schema

```mermaid
erDiagram
    USERS ||--o{ CHARACTERS : owns
    USERS ||--o{ TASKS : creates
    CHARACTERS ||--o{ ATTRIBUTES : has
    CHARACTERS ||--o{ STREAKS : maintains
    CHARACTERS ||--o{ TRANSACTIONS : logs
    CHARACTERS ||--o{ INVENTORY : holds
    SHOP_ITEMS ||--o{ INVENTORY : purchased_as

    USERS {
        uuid id PK
        string email
        string password_hash
        string display_name
        timestamp created_at
    }

    CHARACTERS {
        uuid id PK
        uuid user_id FK
        int level
        int current_xp
        int xp_to_next_level
        int currency_balance
    }

    TASKS {
        uuid id PK
        uuid user_id FK
        string title
        string category "Maps to an attribute"
        string status
        string difficulty
        timestamp created_at
        timestamp completed_at
    }

    ATTRIBUTES {
        uuid id PK
        uuid character_id FK
        string name "Intellect, Strength, etc."
        int value
    }

    STREAKS {
        uuid id PK
        uuid character_id FK
        int current_streak
        int longest_streak
        date last_activity_date
    }

    TRANSACTIONS {
        uuid id PK
        uuid character_id FK
        string type "earn | spend"
        int amount
        string reason
        timestamp created_at
    }

    SHOP_ITEMS {
        uuid id PK
        string name
        int cost
        string type "theme | badge | cosmetic"
    }

    INVENTORY {
        uuid id PK
        uuid character_id FK
        uuid shop_item_id FK
        timestamp acquired_at
    }
```

## 🔄 3. Core Game Loop: Quest Completion Flow

This sequence visualizes what happens when a user completes a task. Notice the optimistic update allowing immediate visual feedback.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant DB as Database (Postgres)

    U->>F: Clicks "Complete Quest"
    
    %% Optimistic UI
    rect rgb(49, 120, 198)
        Note over F: Optimistic Update
        F->>F: Immediately play celebration animation
        F->>F: Locally update XP bar & Currency
    end
    
    F->>B: PATCH /tasks/:id/complete (JWT Auth)
    
    rect rgb(60, 135, 58)
        Note over B: Server-Side Authority
        B->>B: Validate Auth & Task Ownership
        B->>B: Calculate XP (e.g., non-linear curve)
        B->>B: Calculate Streak & Attribute gains
        B->>B: Calculate Currency reward
    end
    
    B->>DB: Begin DB Transaction
    DB-->>B: Update Tasks, Characters, Attributes, Streaks, Transactions
    B->>DB: Commit DB Transaction
    
    B-->>F: Return Authorized Gamestate (200 OK)
    
    %% Reconciliation
    F->>F: Reconcile local state with Server Truth
```

## 🛠️ 4. Tech Stack & Implementation Details

| Category | Technology | Details / Rationale |
| :--- | :--- | :--- |
| **Frontend UI** | React + Vite | Fast HMR, component-based structure. |
| **Styling & Motion** | Tailwind CSS + Framer Motion | Rapid styling, necessary for "juicy" game-feel UI. |
| **State/Cache** | React Query / Zustand | Managing optimistic updates and server-state caching. |
| **Backend API** | Node.js + Express (or NestJS) | Lightweight REST architecture. |
| **Database** | PostgreSQL + Prisma ORM | Relational data integrity (crucial for users/tasks/transactions). |
| **Authentication** | JWT via `httpOnly` cookies | Secure session management (or Supabase/Clerk for speed). |
| **Deployment** | Vercel (Front) + Railway/Render (Back/DB) | Keeps backend and DB in one network dashboard. |

## 👥 5. Team Roles

| Role | Core Responsibilities |
| :--- | :--- |
| **Frontend Engineer** | App shell, React Query caching, game-feel animations, optimistic UI, accessibility. |
| **Backend Engineer** | REST API endpoints, Auth handling, server-side authority for game math, input validation. |
| **Database/API Engineer** | Schema design (Prisma), migrations, seed data, query optimization, API contract co-ownership. |
| **Deploy & UI/UX Lead** | Lock theme by Day 1, component design systems, CI/CD, environments, final smoke tests. |

> [!WARNING]
> **Zero-Tolerance Criteria for Launch:**
> - Data must survive a hard page refresh (no `localStorage` crutches).
> - Backend must connect to a production database.
> - Zero perceptible lag on task completion (Optimistic UI is mandatory).
> - Lighthouse score ≥90 for Performance and SEO.
