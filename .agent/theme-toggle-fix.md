# Theme Toggle Fix - Projects & Contact Sections

## Problem Identified
The Projects and Contact sections were not responding to the day/night theme toggle because they had **hardcoded colors** instead of using CSS variables.

## Root Causes

### Projects Section Issues:
1. **Rope stroke**: Hardcoded `#ffffff` (white)
2. **Animated text background**: Hardcoded `rgb(255, 255, 255)` (white)
3. **Animated text color**: Hardcoded `black`

### Contact Section Issues:
1. **Section background**: Hardcoded `#000000` (black)
2. **Text color**: Hardcoded `#ffffff` (white)
3. **Input backgrounds**: Hardcoded `#00000f` (very dark blue)
4. **Input borders**: Hardcoded `#2a2a3a` (dark purple-gray)
5. **Label colors**: Hardcoded `#6a6a8a` (gray-purple)
6. **Focus states**: Hardcoded white colors
7. **Submit button**: Hardcoded white text and borders
8. **Nebula particles**: Hardcoded `#ffffff` in animation

## Solution Implemented

### 1. Created New CSS Variables

Added theme-specific variables to `:root` (light theme) and `body.dark-theme`:

**Projects Section Variables:**
- `--projects-rope-color`: Rope stroke color
- `--projects-text-bg`: Background of "PROJECTS" text
- `--projects-text-color`: Text color of "PROJECTS"

**Contact Section Variables:**
- `--contact-bg`: Section background
- `--contact-text`: Main text color
- `--contact-input-bg`: Input field backgrounds
- `--contact-input-border`: Input field borders
- `--contact-label-color`: Placeholder/label color
- `--contact-focus-border`: Border color on focus
- `--contact-focus-shadow`: Shadow color on focus

### 2. Light Theme Values (`:root`)

```css
/* Projects */
--projects-rope-color: #1a1a1a;      /* Dark rope */
--projects-text-bg: #1a1a1a;         /* Dark background */
--projects-text-color: #ffffff;      /* White text */

/* Contact */
--contact-bg: #f5f5f5;               /* Light gray background */
--contact-text: #1a1a1a;             /* Dark text */
--contact-input-bg: #ffffff;         /* White inputs */
--contact-input-border: #d0d0d0;     /* Light gray borders */
--contact-label-color: #666666;      /* Medium gray labels */
--contact-focus-border: #1a1a1a;     /* Dark focus border */
--contact-focus-shadow: rgba(26, 26, 26, 0.2);  /* Dark shadow */
```

### 3. Dark Theme Values (`body.dark-theme`)

```css
/* Projects */
--projects-rope-color: #ffffff;      /* White rope */
--projects-text-bg: #ffffff;         /* White background */
--projects-text-color: #000000;      /* Black text */

/* Contact */
--contact-bg: #000000;               /* Pure black background */
--contact-text: #ffffff;             /* White text */
--contact-input-bg: #00000f;         /* Very dark blue inputs */
--contact-input-border: #2a2a3a;     /* Dark purple-gray borders */
--contact-label-color: #6a6a8a;      /* Gray-purple labels */
--contact-focus-border: #ffffff;     /* White focus border */
--contact-focus-shadow: rgba(255, 255, 255, 0.3);  /* White shadow */
```

### 4. Updated All Hardcoded Colors

Replaced every hardcoded color with the appropriate CSS variable:

**Projects Section:**
- `.rope { stroke: var(--projects-rope-color); }`
- `.animated-projects-text { background-color: var(--projects-text-bg); color: var(--projects-text-color); }`

**Contact Section:**
- `.contact-section { background-color: var(--contact-bg); color: var(--contact-text); }`
- `.contact-heading { color: var(--contact-text); }`
- `.nebula-input .input { border: var(--contact-input-border); background: var(--contact-input-bg); color: var(--contact-text); }`
- `.nebula-input .user-label { color: var(--contact-label-color); background: var(--contact-input-bg); }`
- `.nebula-input .input:focus { border-color: var(--contact-focus-border); }`
- `.submit-btn { color: var(--contact-text); border: var(--contact-input-border); }`
- `.submit-btn:hover { background: var(--contact-text); color: var(--contact-bg); }`
- Nebula particle animation: `background: var(--contact-focus-border);`

### 5. Added Smooth Transitions

Added `transition` properties to ensure smooth color changes:
- `transition: stroke var(--transition-speed);` for ropes
- `transition: background-color var(--transition-speed), color var(--transition-speed);` for sections
- `transition: color var(--transition-speed);` for text elements

## Result

✅ **Single Source of Truth**: All theme colors are now defined in CSS variables at the top of the file
✅ **Consistent Behavior**: Projects and Contact sections now respond to theme toggle just like other sections
✅ **Smooth Transitions**: Color changes animate smoothly when toggling themes
✅ **Maintainable**: Easy to adjust colors by changing variable values
✅ **No Layout Changes**: All animations and layouts remain exactly the same

## Testing Checklist

- [ ] Toggle theme switch - Projects section rope color should change
- [ ] Toggle theme switch - Projects "PROJECTS" text should invert colors
- [ ] Toggle theme switch - Contact section background should change
- [ ] Toggle theme switch - Contact form inputs should change colors
- [ ] Toggle theme switch - Contact form labels should change colors
- [ ] Toggle theme switch - Submit button should change colors
- [ ] Focus on input fields - nebula particles should use theme-appropriate colors
- [ ] Hover over submit button - colors should invert correctly
- [ ] All transitions should be smooth (0.3s)
