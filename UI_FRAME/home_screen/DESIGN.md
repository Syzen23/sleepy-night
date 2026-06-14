---
name: Matcha Night
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c3c8bd'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8d9289'
  outline-variant: '#434840'
  surface-tint: '#b1cfa7'
  primary: '#c3e2ba'
  on-primary: '#1d361a'
  primary-container: '#a8c69f'
  on-primary-container: '#395334'
  inverse-primary: '#4a6545'
  secondary: '#b8cbbe'
  on-secondary: '#24342b'
  secondary-container: '#3a4b41'
  on-secondary-container: '#a7baad'
  tertiary: '#d9dada'
  on-tertiary: '#2f3131'
  tertiary-container: '#bdbebe'
  on-tertiary-container: '#4b4d4d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ccebc2'
  primary-fixed-dim: '#b1cfa7'
  on-primary-fixed: '#082007'
  on-primary-fixed-variant: '#334d2f'
  secondary-fixed: '#d4e7da'
  secondary-fixed-dim: '#b8cbbe'
  on-secondary-fixed: '#0f1f17'
  on-secondary-fixed-variant: '#3a4b41'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '300'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '300'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 32px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is centered on the concept of "Digital Somnology"—creating a user interface that respects the user's circadian rhythm and emotional state at the end of the day. The brand personality is empathetic, quiet, and sophisticated, acting as a gentle companion rather than a demanding tool.

The visual style is a fusion of **Minimalism** and **Glassmorphism**, specifically optimized for low-light environments. By utilizing deep, organic greens and soft, desaturated accents, the interface minimizes eye strain while maintaining a premium, editorial feel. The aesthetic mimics the diffusion of moonlight through mist, using soft glows and frosted layers to create depth without the need for harsh shadows or high-contrast dividers.

## Colors

The color palette is built on a foundation of "Restorative Darkness." 

- **Primary (Matcha):** Used for interactive elements, primary call-to-actions, and active states. It provides a soft, organic focus point that doesn't "pierce" the dark background.
- **Secondary (Deep Forest):** The primary container and surface color, providing a lush, natural depth that feels more comforting than pure black.
- **Neutral (Charcoal):** Used for the base background layer to ensure the deepest levels of the UI disappear into the hardware's bezel.
- **Tertiary (Moonlight White):** A slightly warm off-white reserved for high-priority text and iconography to maintain legibility without the glare of pure #FFFFFF.

Gradients should transition smoothly from `#0A1A12` to `#050505` at a 145-degree angle to simulate natural light fall-off.

## Typography

This design system utilizes **Geist** for its technical precision and clinical cleanliness, which balances the organic nature of the color palette. 

The typographic scale emphasizes air and breathability. Headlines use a light font weight (`300`) to feel elegant and non-aggressive. Body text is given a generous `1.6x` line height to improve readability for tired eyes. Tracking (letter-spacing) is slightly increased for body and label roles to prevent characters from blurring together at low brightness levels. Use sentence case for most headings to maintain a conversational, companion-like tone.

## Layout & Spacing

The layout follows a **fluid grid** model with significant negative space. To evoke a sense of calm, the standard 16px margins are doubled to **32px** on mobile, pushing content toward the center and creating a "floating" effect.

Spacing follows a strict 8pt linear scale. Vertically, components are separated by "breathing zones" (`stack-lg`) to prevent the UI from feeling cluttered. On desktop, the content is capped at a 1200px max-width, centered, with a 12-column layout. On mobile, elements primarily stack in a single column, utilizing high-padding cards to define information hierarchy.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and **Luminous Layering** rather than traditional drop shadows.

1.  **The Base:** The bottom-most layer is the Charcoal/Forest gradient.
2.  **The Surface:** Interactive cards use a backdrop filter (`blur: 20px`) with a high-transparency fill (`#FFFFFF05`). 
3.  **The Stroke:** Surfaces are defined by a 1px "inner-glow" border. The top and left borders use a slightly higher opacity Moonlight White to simulate a light source from the top-left, while the bottom and right borders remain nearly invisible.
4.  **The Bloom:** For active AI states or primary buttons, a soft green outer glow (`spread: 20px`, `blur: 40px`, `opacity: 0.15`) is used to suggest life and energy within the component.

## Shapes

The shape language is extremely soft and approachable. High roundedness (`level 3`) is applied across all major components to eliminate "sharp" visual triggers that cause subconscious tension.

Main content cards and containers use a `24px` to `32px` corner radius. Smaller elements like chips or buttons follow a pill-shaped convention. This consistency in curvature reinforces the friendly, non-threatening nature of the AI companion.

## Components

- **Buttons:** Primary buttons are pill-shaped with a solid Matcha Green background and Charcoal text. Secondary buttons use the glassmorphic style with a subtle white stroke.
- **AI Chat Bubbles:** The AI's responses utilize the glassmorphic effect with a subtle Matcha-tinted border, while user messages are simpler, text-only or outlined, to keep the focus on the AI's guidance.
- **Input Fields:** Search and text inputs are large (`height: 64px`) with a `rounded-xl` radius. The background is a slightly darker shade of Forest green with no border until focused.
- **Chips/Filters:** Used for mood selection or quick replies. These are pill-shaped with a low-opacity Moonlight White fill and transition to solid Matcha when selected.
- **Progress Bars:** Thin, `4px` tracks with a glowing Matcha head, used for breathing exercises or sleep tracking timers.
- **Cards:** Feature a high backdrop-blur and are used to group sleep data or insights. Padding within cards is generous (`24px` minimum).