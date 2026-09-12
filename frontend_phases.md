# Life RPG - Frontend Redesign Phases (Cozy Fantasy Theme)

Based on the uploaded mockup, we are scrapping the dark cyberpunk theme and switching to a **Mobile-First, Light-Mode "Cozy Fantasy"** aesthetic. 

## Global Design System
*   **Theme**: Light, airy, soft shadows (apple-esque/neumorphic), highly rounded corners.
*   **Colors**: Off-white/slate-50 backgrounds, Yellow/Gold (XP/Coins), Red (HP), Blue (Mana).
*   **Typography**: Friendly, rounded sans-serif (e.g., *Nunito* or *Quicksand*).
*   **Layout**: Mobile-first constraints. On desktop, the app will be contained in a centered phone-sized wrapper. 
*   **Navigation**: A fixed bottom tab bar instead of a sidebar.

---

## Phase 1: Clean Slate & Global Layout
*   **Action**: Delete all current dark-mode pages and layouts.
*   **Fonts**: Inject `Nunito` via Next/Font.
*   **Layout Structure**: Create the main mobile wrapper (`max-w-md mx-auto min-h-screen bg-slate-50 relative pb-20`).
*   **Header**: Top bar with a Crown Icon, "Life RPG" title, Notification Bell, and Settings Gear.
*   **Bottom Nav**: Fixed bottom bar with icons for `Home`, `Quests`, `Shop`, `Journal`, `More`.

## Phase 2: Home Screen (`/`)
*   **Hero Card**: A soft card featuring a 3D Avatar character, a motivational quote ("A Brighter You"), and a prominent `Lv. 12` badge.
*   **Stat Bars**: Three pill-shaped progress bars with soft 3D gradients:
    *   ❤️ HP (Red)
    *   💧 Mana (Blue)
    *   ⭐ Mastery XP (Yellow)
*   **Attributes Grid**: A 3-column row of cute icons for "Discipline", "Growth", and "Kindness".
*   **Today's Focus**: A card highlighting the most important daily habit.

## Phase 3: Quest Log Screen (`/quests`)
*   **Header Tabs**: Pill-shaped toggle switches for `Active`, `Completed`, `All`.
*   **Quest Cards**: White, heavily rounded cards with soft drop shadows.
    *   *Left*: A colorful, illustrative icon (Sun, Book, Dumbbell).
    *   *Center*: Title, description, and an empty circle checkbox.
    *   *Right*: A yellow badge indicating the reward (e.g., `⭐ +50 XP`).

## Phase 4: Shop Screen (`/shop`)
*   **Currency Display**: A pill at the top showing current coin balance (`⭐ 1,240`).
*   **Header Tabs**: `All`, `Gear`, `Boosts`, `Cosmetics`.
*   **Banner**: A promotional banner ("Better Habits, Better Adventures").
*   **Item Grid**: A 2-column grid of store items. Each card contains:
    *   A large 3D illustrative icon (Cloak, Book, Corgi).
    *   Item Name and stat boost (e.g., "+10 Focus").
    *   A yellow purchase button showing the coin cost.

## Phase 5: Level Up Modal
*   **Trigger**: A state that overlays the entire screen when the XP bar fills up.
*   **Visuals**: A large celebrating avatar, glowing background, and massive "LEVEL UP! Lv. 13" text.
*   **Stat Increases**: A clean list showing old stats animating to new stats (e.g., `Max HP 100 -> 110`).
*   **Action**: A large, full-width yellow `Continue` button at the bottom.

---

> **Ready to Execute?** Once you approve this markdown plan, I will immediately begin executing **Phase 1** using our strict atomic commit workflow (one file at a time, commit, push).
