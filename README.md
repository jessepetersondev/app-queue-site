# Counter App 5567

A simple, responsive, and accessible counter application built with vanilla HTML, CSS, and JavaScript.

## Features

- **Increment/Decrement**: Use buttons or keyboard shortcuts to modify the counter
- **Reset**: Reset counter to zero
- **Persistent State**: Counter value is saved in localStorage
- **Keyboard Navigation**: Full keyboard accessibility support
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Screen Reader Support**: ARIA labels and live regions for accessibility
- **Visual Feedback**: Smooth animations and transitions
- **Dark Mode Support**: Automatically adapts to system preference

## Usage

### Button Controls
- **+** button: Increment counter by 1
- **-** button: Decrement counter by 1
- **Reset** button: Reset counter to 0

### Keyboard Shortcuts
- `↑` or `+` or `=`: Increment counter
- `↓` or `-`: Decrement counter
- `r` or `0`: Reset counter
- `Tab`: Navigate between buttons
- `Enter` or `Space`: Activate focused button

## Installation

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Accessibility Features

- **ARIA Labels**: All interactive elements have descriptive labels
- **Live Regions**: Counter changes are announced to screen readers
- **Keyboard Navigation**: Full keyboard support with visual focus indicators
- **High Contrast**: Supports high contrast mode preferences
- **Reduced Motion**: Respects prefers-reduced-motion settings

## Technical Details

### Architecture
- **HTML5**: Semantic markup with proper ARIA attributes
- **CSS3**: Modern CSS with custom properties and responsive design
- **ES6+ JavaScript**: Modular code with classes and modern features
- **localStorage**: Persistent counter state across sessions

### File Structure
```
counter-app-5567/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── reset.css       # CSS reset and base styles
│   │   └── styles.css      # Main application styles
│   └── js/
│       ├── app.js          # Main application logic
│       ├── counter.js      # Counter state management
│       └── storage.js      # localStorage utilities
├── favicon.ico             # Application favicon
└── README.md              # This file
```

### Performance
- **No Dependencies**: Pure vanilla JavaScript for fast loading
- **Optimized CSS**: Efficient selectors and minimal reflows
- **Event Delegation**: Efficient event handling
- **Small Bundle**: Less than 20KB total size

## Customization

The application uses CSS custom properties for easy theming. Key variables include:

```css
:root {
    --primary-color: #007bff;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --background-color: #f8f9fa;
    /* ... and more */
}
```

### Counter Configuration

The counter can be configured with various options:

```javascript
const counter = new Counter(0, {
    minValue: -1000,           // Minimum allowed value
    maxValue: 1000,            // Maximum allowed value
    persistValue: true,        // Save to localStorage
    enableHistory: true,       // Track change history
    validateBounds: true       // Enforce min/max values
});
```

## Development

### Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. Make changes and refresh to see updates

### Testing
The application includes comprehensive error handling and input validation:
- Boundary checking for counter values
- localStorage availability detection
- Graceful fallbacks for unsupported features
- Console logging for debugging

### Debugging
Access the counter instance in browser console:
```javascript
// Get current counter state
window.counterApp.getState();

// Reset the entire application
window.counterApp.resetApp();

// Access counter methods directly
window.counterApp.counter.getValue();
```

## License

This project is released under the MIT License. See the source code for details.

## Future Enhancements

Potential features for future versions:
- Multiple named counters
- Custom increment/decrement amounts
- Export counter data
- Themes and color customization
- Sound effects
- Counter limits and goals
- Statistics and analytics

## Contributing

This is a demonstration project. For suggestions or improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with your changes

## Credits

Built with modern web standards and accessibility best practices in mind.

---

**Counter App 5567** - Simple. Fast. Accessible.