# Design System Strategy: The Digital Arboretum

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Arboretum."** 

Unlike standard data apps that feel cold and mechanical, this system treats lawn analysis as a high-end editorial experience. We are moving away from the "dashboard-in-a-box" aesthetic toward a layout that feels grown, not just built. We achieve this through **Intentional Asymmetry**—where data visualizations might bleed off the edge of a container—and **Tonal Depth**, using the Material Design surface tokens to create a sense of physical soil layers. The goal is to make the user feel like they are looking through a high-powered lens at a living ecosystem, blending the precision of a laboratory with the serenity of a botanical garden.

## 2. Colors & Surface Architecture
The palette is rooted in the "Primary Green" (`#0d631b`) and "Secondary Earth" (`#7a5649`), but the soul of the system lies in how we layer the neutrals.

### The "No-Line" Rule
To maintain an organic, premium feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts. 
*   **Example:** A `surface-container-low` (`#f4f4f0`) section sitting directly on a `surface` (`#faf9f5`) background. The distinction is felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the surface-container tiers to create "nested" depth:
*   **Base Level:** `surface` (`#faf9f5`) for the main app canvas.
*   **Structural Sections:** `surface-container-low` for large content blocks.
*   **Actionable Cards:** `surface-container-lowest` (`#ffffff`) placed atop a low-tier section to create a soft, natural lift.
*   **Information Nodes:** `surface-container-high` (`#e8e8e4`) for inset data points or secondary sidebar elements.

### The "Glass & Gradient" Rule
To break the "flat" look, floating elements (like mobile navigation bars or hovered state cards) should utilize **Glassmorphism**:
*   Use `surface` at 80% opacity with a `20px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs or Hero sections, apply a subtle linear gradient from `primary` (`#0d631b`) to `primary-container` (`#2e7d32`) at a 135-degree angle. This adds "visual soul" and depth that flat color cannot provide.

## 3. Typography: The Editorial Voice
Our typography pairing balances scientific precision with a human touch.

*   **Display & Headlines (Manrope):** This geometric sans-serif acts as our "Architectural" voice. Use `display-lg` (3.5rem) with tight tracking (-0.02em) for high-impact data hero moments (e.g., "92% Soil Health").
*   **Title, Body & Labels (Work Sans):** Work Sans provides an approachable, "Field Guide" feel. It is highly legible at small sizes for technical lawn analysis data.
*   **Hierarchy Note:** Always maintain a significant scale jump between `headline-md` and `body-md`. Use `on-surface-variant` (`#40493d`) for body text to reduce visual vibration and keep the reading experience "soft."

## 4. Elevation & Depth
We eschew traditional "Drop Shadows" in favor of **Tonal Layering.**

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural elevation.
*   **Ambient Shadows:** If a floating element (like a Modal) requires a shadow, it must be diffused: `0px 12px 32px rgba(26, 28, 26, 0.06)`. The shadow color is a 6% tint of `on-surface`, never pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use the `outline-variant` (`#bfcaba`) at **15% opacity**. 100% opaque borders are strictly forbidden.
*   **Glassmorphism:** Use semi-transparent `surface-variant` with a blur for tooltips to let the "greenery" of the lawn data bleed through the UI, making the interface feel integrated with the environment.

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), white text, `xl` (0.75rem) rounded corners.
*   **Secondary:** `secondary-container` (`#fdcdbc`) fill with `on-secondary-container` (`#795548`) text. No border.
*   **Tertiary:** Ghost style. `on-surface` text with no background. High-alpha `primary` ripple effect on tap.

### Input Fields
*   **Style:** Filled style using `surface-container-highest` (`#e2e3df`). 
*   **Focus State:** No thick border. Instead, transition the background to `surface-container-lowest` and add a `2px` bottom indicator in `primary`.

### Cards & Lists
*   **No Dividers:** Forbid the use of line dividers. Use **Spacing 8** (2rem) to separate list items or subtle background shifts (`surface-container-low` to `surface-container-high`).
*   **Data Cards:** Should use `lg` (0.5rem) roundedness. Use `on-tertiary-container` for subtle background labels within the card.

### Signature Component: The "Growth Metric" Meter
A custom data-driven component for this app. Use a thick, non-linear progress arc using `primary` for the "current" state and `tertiary-fixed` for the "track." Surround this with `display-sm` typography to prioritize the metric.

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical padding. Give the top and left of a container more "breath" (Spacing 12 or 16) than the bottom to create an editorial flow.
*   **Do** use `primary-fixed` (`#a3f69c`) as a highlight background for small badges or "optimal" status indicators.
*   **Do** lean into white space. If a screen feels crowded, increase the spacing rather than adding a box or line.

### Don't:
*   **Don't** use pure black (#000) for text. Always use `on-surface` (`#1a1c1a`).
*   **Don't** use standard `DEFAULT` (0.25rem) rounding for large containers; it looks "off-the-shelf." Use `xl` (0.75rem) for main cards and `full` for chips.
*   **Don't** use high-saturation reds for "Warning" states. Use `error` (`#ba1a1a`) tucked inside an `error-container` (`#ffdad6`) to keep the palette sophisticated and "muted-natural."
