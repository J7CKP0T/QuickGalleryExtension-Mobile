# Quick Gallery - SillyTavern Extension

A mobile-optimized gallery viewer extension for SillyTavern that provides quick access to character images directly from the chat interface.

## Features

✨ **One-Click Access** - Floating button for instant gallery access without navigating to character profile

📱 **Mobile-Optimized** - Sleek, responsive UI that works perfectly on mobile devices

🎨 **Modern Design** - Beautiful gradient-based UI with smooth animations

🖼️ **Image Viewer** - Full-screen image viewer with navigation controls

⌨️ **Keyboard Navigation** - Arrow keys and ESC for desktop users

🎯 **Lightweight** - Minimal performance impact, loads images efficiently

## Installation

### Method 1: Direct Installation (Recommended)

1. **Locate your SillyTavern installation folder**

2. **Navigate to extensions directory:**
   ```
   SillyTavern/public/scripts/extensions/third-party/
   ```

3. **Create a new folder:**
   ```
   mkdir quick-gallery
   cd quick-gallery
   ```

4. **Copy the extension files:**
   - `index.js` - Main extension code
   - `style.css` - Styling
   - `manifest.json` - Extension metadata
   - `README.md` - Documentation

5. **Restart SillyTavern**

6. **Enable the extension:**
   - Open SillyTavern
   - Click the Extensions icon (top menu)
   - Find "Quick Gallery" in the list
   - Enable it

### Method 2: Git Installation

1. **Navigate to the extensions directory:**
   ```bash
   cd SillyTavern/public/scripts/extensions/third-party/
   ```

2. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/SillyTavern-QuickGallery.git quick-gallery
   ```

3. **Restart SillyTavern**

4. **Enable the extension in the Extensions panel**

## Usage

### Opening the Gallery

1. **Click the floating gallery button** (purple circle icon) in the bottom-right corner of the screen

2. **Browse images** in the grid view

3. **Click any image** to view it in full-screen mode

### Image Viewer Controls

**Desktop:**
- Click image to open viewer
- `←` / `→` Arrow keys to navigate
- `ESC` to close viewer
- Click navigation arrows to browse

**Mobile:**
- Tap image to open viewer
- Tap side arrows to navigate
- Tap close button (X) to exit
- Swipe gestures work naturally

## File Structure

```
quick-gallery/
├── index.js          # Main extension logic
├── style.css         # Styling and animations
├── manifest.json     # Extension metadata
└── README.md         # Documentation
```

## Configuration

The extension works out-of-the-box with no configuration needed. It automatically:
- Detects the current character
- Loads images from the character's folder
- Updates when you switch characters
- Adapts to mobile/desktop screens

## Customization

### Changing Button Position

Edit in `style.css`:
```css
#quick-gallery-btn {
    bottom: 80px;  /* Adjust vertical position */
    right: 20px;   /* Adjust horizontal position */
}
```

### Changing Theme Colors

Edit the gradient in `style.css`:
```css
#quick-gallery-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Compatibility

- **Minimum SillyTavern Version:** 1.12.0
- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile:** iOS Safari, Android Chrome
- **Desktop:** Windows, macOS, Linux

## Troubleshooting

### Gallery button not appearing
- Ensure the extension is enabled in Extensions panel
- Check browser console for errors (F12)
- Verify all files are in the correct directory

### Images not loading
- Ensure character has images in their folder
- Check that images are in the correct directory:
  ```
  SillyTavern/public/characters/[character-name]/
  ```
- Verify image formats are supported (PNG, JPG, WEBP)

### Modal not closing
- Try pressing ESC key
- Click the overlay (dark area) outside the modal
- Refresh the page if stuck

## Development

### Testing Locally

1. Make changes to the extension files
2. Reload SillyTavern (or just refresh the page)
3. Test the changes

### Adding Features

The extension uses vanilla JavaScript and can be extended. Common areas:
- `loadCharacterGallery()` - Modify how images are loaded
- `openViewer()` - Customize the image viewer
- `style.css` - Adjust styling and animations

## Publishing to GitHub

### Initial Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `SillyTavern-QuickGallery`
   - Make it public
   - Don't initialize with README (we have one)

2. **Initialize git in your extension folder:**
   ```bash
   cd quick-gallery
   git init
   git add .
   git commit -m "Initial commit: Quick Gallery extension"
   ```

3. **Connect to GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/SillyTavern-QuickGallery.git
   git branch -M main
   git push -u origin main
   ```

### Updating the Extension

```bash
git add .
git commit -m "Description of your changes"
git push
```

### Users Can Install Via Git

Once published, users can install directly:
```bash
cd SillyTavern/public/scripts/extensions/third-party/
git clone https://github.com/yourusername/SillyTavern-QuickGallery.git quick-gallery
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## License

MIT License - Feel free to modify and distribute

## Credits

Created for SillyTavern community
Inspired by the need for better mobile gallery access

## Support

For issues and feature requests:
- Open an issue on GitHub
- Join SillyTavern Discord
- Check SillyTavern documentation: https://docs.sillytavern.app/

## Changelog

### v1.0.0 (Initial Release)
- Floating gallery button
- Mobile-optimized grid view
- Full-screen image viewer
- Keyboard navigation
- Auto character detection
- Smooth animations

---

**Enjoy browsing your character galleries with ease!** 🎨✨
