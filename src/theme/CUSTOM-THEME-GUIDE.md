Here's a breakdown of how these theme colors are typically used in a React Native app with Material Design 3 (MD3) components:

### 1. Core Color Roles

#### primary

- Main brand color for key interactive elements

- Used for: FABs, important buttons, active states

- Example: backgroundColor: theme.colors.primary

#### secondary

- Secondary brand color for less prominent UI

- Used for: Toggle buttons, selection controls, progress indicators

- Example: borderColor: theme.colors.secondary

#### tertiary

- Accent color for contrasting elements

- Used for: Highlights, badges, complementary elements

- Example: color: theme.colors.tertiary

#### 2. Surface & Background

#### surface

- Color of components like cards, sheets, menus

- Example: Card background: backgroundColor: theme.colors.surface

#### surfaceVariant

- Alternative surface color for differentiation

- Used for: Secondary containers, contrasting surfaces

- Example: backgroundColor: theme.colors.surfaceVariant

#### background

- Main app background color

- Example: Screen background: backgroundColor: theme.colors.background

### 3. Text & Icons

#### onPrimary

- Text/icon color when placed on primary-colored backgrounds

- Example: Text inside primary button: color: theme.colors.onPrimary

#### onSecondary

- Text/icon color on secondary-colored backgrounds

- Example: Icon in secondary button: color: theme.colors.onSecondary

#### onSurface

- Main text color for regular content

- Example: Body text: color: theme.colors.onSurface

#### onBackground

- Text color against background color

- Example: Text directly on app background: color: theme.colors.onBackground

### 4. State Colors

#### error

- Color for error states and messages

- Example: Error text: color: theme.colors.error

#### disabled

- Color for disabled components

- Example: Disabled button: backgroundColor: theme.colors.disabled

#### placeholder

- Color for input placeholders

- Example: TextInput placeholder: color: theme.colors.placeholder

### 5. Container Colors

#### primaryContainer

- Subtle background for primary-related elements

- Example: Selected tab background: backgroundColor: theme.colors.primaryContainer

#### secondaryContainer

- Background for secondary-related elements

- Example: Tag/chip background: backgroundColor: theme.colors.secondaryContainer

#### errorContainer

- Background for error messages/alerts

- Example: Error banner background: backgroundColor: theme.colors.errorContainer

### 6. Special Purpose

#### outline

- Border/divider color

- Example: TextInput border: borderColor: theme.colors.outline

#### elevation

- Shadow colors for different elevation levels

- Example: Card shadow: elevation: 2 + theme handles color

#### inverseSurface

- For elements that need to invert their colors

- Example: Dark text on light surface in dark mode

### Dark/Light Differences

#### Light Theme

- Higher contrast between surface/background

- More vibrant primary colors

- Lighter elevation shadows

#### Dark Theme

- Dark surfaces with light text

- Softer primary colors

- Subtler elevation using light overlays

### Best Practices

- Always use theme colors instead of hard-coded values

- Use on\* colors for text/icons on colored backgrounds

- For disabled states, use surfaceDisabled + onSurfaceDisabled

- Use elevation levels (0-5) instead of custom shadows

- Test color contrast ratios for accessibility

### Common Patterns

```javascript
// Card component
backgroundColor: theme.colors.surface;
borderColor: theme.colors.outline;
textColor: theme.colors.onSurface;

// Error message
backgroundColor: theme.colors.errorContainer;
textColor: theme.colors.onErrorContainer;

// Disabled input
backgroundColor: theme.colors.surfaceDisabled;
borderColor: theme.colors.disabled;
textColor: theme.colors.onSurfaceDisabled;
```
