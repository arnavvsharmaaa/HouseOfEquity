---
name: Plain Clarity
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#535e7b'
  on-secondary: '#ffffff'
  secondary-container: '#d1dcfe'
  on-secondary-container: '#56607d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1b1a'
  on-tertiary-container: '#868382'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#bbc6e7'
  on-secondary-fixed: '#0f1b34'
  on-secondary-fixed-variant: '#3b4662'
  tertiary-fixed: '#e6e2df'
  tertiary-fixed-dim: '#cac6c4'
  on-tertiary-fixed: '#1c1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '500'
    lineHeight: 68px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 50px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.005em
  body-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
  space-3xl: 6rem
---

## Brand & Style

This design system is engineered for calm confidence, total legibility, and effortless navigation. Tailored for homeowners, downsizers, and mortgage seekers across all age demographics—specifically prioritizing older adults—the interface eliminates visual noise, high-stress micro-interactions, and tech-centric embellishments.

The overarching aesthetic is rooted in Modern Warm Minimalism:
- Zero gradients, drop blurs, or colored glowing states.
- Ample, intentional whitespace that frames complex financial decisions as quiet, manageable steps.
- Highly structural, accessible contrast ratios that comfortably surpass WCAG AAA standards.
- Grounded, dependable forms: large touch targets, tactile pill buttons, and soft-cornered structural cards.

## Colors

The palette is deliberately restrained, relying on neutral tonal stepping rather than chromatic density:

- **Primary Canvas & Contrast (`#FFFFFF` & `#1A1A1A`):** The default background is crisp pure white (`#FFFFFF`). High-priority text and primary actions use an ink-like near-black (`#1A1A1A`), offering maximum legibility without the eye fatigue of absolute synthetic black.
- **Surface Panels (`#F5F5F5` & `#E5E5E5`):** Feature sections, nested blocks, and form wells sit on soft light-gray surfaces (`#F5F5F5`) bounded by subtle structural outlines (`#E5E5E5`).
- **Body & Secondary Text (`#4A4A4A` & `#71717A`):** Body paragraphs sit at `#4A4A4A` for a balanced, approachable reading cadence. Supporting metadata and secondary captions use balanced gray (`#71717A`).
- **Accent Navy (`#1F2A44` & `#EEF1F7`):** Reserved exclusively for interactive text links, selected state pills, category badges, and active toggle markers. Pale navy tint (`#EEF1F7`) acts as the resting fill for navy pills and badge containers.
- **Strict Exclusions:** Zero green, zero bright decorative saturations, zero multi-color gradients.

## Typography

The typography leverages Inter exclusively, tuned for approachable human scale rather than brutalist authority. 

- **Weight Discipline:** Headings strictly avoid bold and extra-bold cuts (`700+`). They are set at medium (`500`) or normal (`400`) weight to maintain an inviting, editorial feel even at large display sizes.
- **Reading Comfort:** Key editorial and instructional text uses large baseline sizes (`19px` to `20px`) with generous leading (`30px` to `32px`). This ensures effortless scanning for users wearing reading glasses or browsing on high-resolution displays.
- **Hierarchy Rules:** Headings use slight negative letter-tracking for optical stability. Micro-labels and pill chips use `label-md` or `label-sm` with slight positive tracking to ensure small caps and compact titles remain legible.

## Layout & Spacing

The layout is built around a grounded, readable container model with generous vertical breathing room:

- **Grid Strategy:** Maximum container width of `1200px`, centered with fluid margins. Uses a standard 12-column system on desktop, collapsing to 6 columns on tablet, and 4 or 1 column on mobile.
- **Section Rhythm:** Sections alternate between the clean `#FFFFFF` page background and structural `#F5F5F5` full-width or inset panels. Standard vertical spacing between major page sections is generous (`space-3xl` / 96px on desktop, `space-xl` / 40px on mobile).
- **Reflow & Padding:** Content cards maintain minimum internal padding of `space-lg` to `space-xl`, ensuring touch targets never feel crowded.

## Elevation & Depth

This design system avoids drop shadows, colored atmospheric glows, and artificial z-plane floating. Depth is achieved entirely through planar surfaces and line boundaries:

- **Flat Surface Separation:** Structural hierarchy is established by layering `#FFFFFF` cards atop `#F5F5F5` section panels, or placing `#F5F5F5` input containers over `#FFFFFF` canvas.
- **Low-Contrast Outlines:** Surfaces are demarcated by a razor-thin `1px` border in `#E5E5E5`. Secondary interactive components use `#D1D5DB` or `#1A1A1A` for active or focused states.
- **Interactive State Transitions:** Hover states avoid vertical translation (lifting/floating) or shadow blooming. Instead, elements react with subtle border darkening, subtle fill shifts (e.g., `#FFFFFF` to `#F9FAFB`), or color fill inversions.

## Shapes

The design balances crisp architectural containers with welcoming, ergonomic touchpoints:

- **Pill Philosophy (`9999px`):** All actionable buttons, state pills, filter chips, and interactive dropdown toggles use full pill geometry. This provides an unambiguous visual cue for interactivity and touch-friendliness.
- **Card & Panel Radius (`16px` - `20px`):** Structural content cards, modal windows, and inner `#F5F5F5` content blocks utilize balanced `16px` to `20px` corner radii. Outer wrapper panels use `24px` to create a harmonious nested nested-corner ratio.
- **Icon Circles (`50%`):** Line icon glyphs sit inside perfect `40px` or `48px` circular containers filled with soft neutral tones (`#F0F2F5` or `#EEF1F7`).

## Components

### Buttons
- **Primary Buttons:** Solid near-black fill (`#1A1A1A`), pure white text (`#FFFFFF`), full pill radius (`9999px`), minimum height of `48px` (desktop standard `52px`), horizontal padding of `28px`. Hover: shifts to `#333333`.
- **Secondary Buttons:** White fill (`#FFFFFF`), `1px` or `1.5px` border in `#1A1A1A` or `#D1D5DB`, near-black text (`#1A1A1A`), minimum height `48px`, full pill radius. Hover: background shifts to `#F5F5F5`.
- **Text / Inline Actions:** Navy (`#1F2A44`) typography with an explicit underline or chevron indicator, minimum touch target wrapper of `48px x 48px`.

### Cards
- **Structure:** Clean white background (`#FFFFFF`), `16px` to `20px` border radius, `1px` solid border (`#E5E5E5`).
- **Padding:** Minimum internal inset of `24px` to `32px`.
- **Icon Treatment:** Functional icons are simple 1.5px stroke monochrome vector lines set inside a `40px` circular badge with a muted wash (`#F0F2F5` neutral or `#EEF1F7` navy tint).
- **Shadows:** Zero box-shadows.

### Chips & Filter Pills
- **Resting:** Pale navy tint (`#EEF1F7`) or subtle gray (`#F5F5F5`) background, deep navy (`#1F2A44`) or dark text, full pill roundedness, `36px` to `40px` height.
- **Active / Selected:** Deep Navy fill (`#1F2A44`) with white text (`#FFFFFF`), or distinct `1.5px` navy border.

### Form Inputs & Dropdowns
- **Containers:** Minimum height `52px` for effortless finger tap or stylus use. White fill, `1px` border (`#D1D5DB`), `12px` roundedness (or pill for quick selects).
- **Typography:** `18px` to `20px` input values in `#1A1A1A`. Labels in `#1F2A44` or `#4A4A4A` at `14px` medium.
- **Focus State:** `2px` solid `#1F2A44` outline with zero exterior blur or glowing ring.

### Checkboxes & Radio Buttons
- **Geometry:** Large `24px x 24px` hit areas. Radios are circular; checkboxes use `6px` rounded corners.
- **States:** Unchecked shows a clean `1.5px` border in `#D1D5DB`. Checked uses a solid `#1A1A1A` or `#1F2A44` fill with crisp white internal checks/dots.

### Mortgage Calculator Sliders & Readouts
- **Track & Thumb:** Minimal `6px` light-gray track (`#E5E5E5`) with an oversized `28px` solid `#1A1A1A` circular thumb handle.
- **Readouts:** Large numeric typography (`headline-lg` / `headline-md`) in `#1A1A1A` accompanied by clear, regular-weight unit descriptors.