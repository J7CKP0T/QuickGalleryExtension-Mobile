# Mobile Gallery - SillyTavern Extension

A mobile-optimized gallery viewer for SillyTavern that provides quick access to character images through a floating button and slide-in panel interface.

## ✨ Features

- **🎯 Floating Button** - Always-accessible circular button that doesn't obstruct chat
- **📱 Mobile-First Design** - Optimized slide-in panel that doesn't hog the screen
- **🖼️ Thumbnail Strip** - Horizontal scrollable thumbnails for quick navigation
- **👆 Touch-Friendly** - Large touch targets and swipe-friendly interface
- **⚙️ Customizable** - Settings panel for button position, size, and behavior
- **🎨 Theme-Aware** - Adapts to your SillyTavern theme
- **⚡ Performance** - Lazy loading and efficient rendering
- **📸 Caption Support** - Optional filename captions
- **🔄 Auto-Refresh** - Updates when switching characters (optional)

## 🚀 Installation

### Method 1: GitHub URL (Recommended)

1. Open SillyTavern
2. Click **Extensions** (puzzle icon in top bar)
3. Click **Install Extension**
4. Paste: `https://github.com/J7CKP0T/QuickGalleryExtension-Mobile`
5. Click **Install**
6. Refresh the page

### Method 2: Manual Installation

1. Navigate to your SillyTavern folder
2. Go to: `public/scripts/extensions/third-party/`
3. Create a folder named `mobile-gallery`
4. Copy these files into the folder:
   - `manifest.json`
   - `index.js`
   - `style.css`
   - `README.md`
5. Restart SillyTavern
6. Enable the extension in Extensions panel

## 📖 Usage

### Opening the Gallery

1. **Click the floating button** - Purple circular icon in corner (default: bottom-right)
2. Panel slides up from bottom showing thumbnails and main viewer
3. **Click thumbnails** to view different images
4. **Use arrow buttons** to navigate between images
5. **Click X** or slide down to close

### Mobile Gestures

- **Tap** floating button to open
- **Tap** thumbnails to switch images
- **Tap** arrows to navigate
- **Tap** X button to close

### Keyboard Shortcuts (Desktop)

- **Left/Right Arrow** - Navigate between images
- **Escape** - Close gallery

## ⚙️ Settings

Access settings via **Extensions → Mobile Gallery Settings**

### Button Options

- **Enable/Disable** - Toggle extension on/off
- **Button Position** - Choose corner placement:
  - Bottom Right (default)
  - Bottom Left
  - Top Right
  - Top Left
- **Button Size** - Small, Medium (default), or Large

### Display Options

- **Show Captions** - Display image filenames below viewer
- **Auto-Load on Character Change** - Refresh gallery when switching characters

## 🎨 Customization

### Changing Button Colors

Edit `style.css` line 11:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjusting Panel Height

Edit `style.css` line 81:
```css
height: 70vh; /* Change percentage as desired */
```

### Panel Position

Currently supports bottom slide-in. To modify, edit the `.mobile-gallery-panel` class.

## 🔧 Technical Details

### File Structure
```
mobile-gallery/
├── manifest.json    # Extension metadata
├── index.js         # Main JavaScript logic
├── style.css        # Mobile-optimized styles
└── README.md        # Documentation
```

### How It Works

1. **Initialization** - Waits for SillyTavern to load via jQuery
2. **Button Creation** - Injects floating button into DOM
3. **Panel Creation** - Creates hidden slide-in panel
4. **Character Detection** - Monitors character changes via eventSource
5. **Image Loading** - Fetches gallery from `/api/characters/get`
6. **Rendering** - Displays thumbnails and main viewer
7. **Navigation** - Handles thumbnail clicks and arrow navigation

### API Endpoints Used

- `/api/characters/get?name={characterName}` - Fetches character data including gallery

### Event Listeners

- `CHAT_CHANGED` - Detects character switches
- `CHARACTER_EDITED` - Detects character updates

## 🐛 Troubleshooting

### Button Not Appearing

**Check:**
- Extension is enabled in Extensions panel
- Button is not set to "disabled" in settings
- No JavaScript errors in console (F12)

**Fix:**
1. Open Extensions panel
2. Find "Mobile Gallery"
3. Ensure checkbox is checked
4. Refresh page

### Gallery Empty (But Character Has Images)

**Check:**
- Images are in character folder: `/public/characters/[character-name]/`
- Character has gallery data in extensions

**Fix:**
1. Open character editor
2. Upload images to gallery
3. Save character
4. Reopen gallery

### Images Not Loading

**Check:**
- Console (F12) for 404 errors
- Image file paths are correct
- Images are valid formats (PNG, JPG, WEBP)

**Debug:**
```javascript
// In console:
const ctx = SillyTavern.getContext();
console.log(ctx.characters[ctx.characterId]);
```

### Panel Won't Close

**Try:**
- Click X button
- Tap outside panel area
- Refresh page if stuck

**Emergency Fix:**
```javascript
// In console:
$('#mobile-gallery-panel').removeClass('open');
$('body').removeClass('mobile-gallery-no-scroll');
```

### Button Overlaps Chat

**Fix:**
1. Go to Settings
2. Change "Button Position" to different corner
3. Or adjust CSS `.mobile-gallery-fab` position values

## 📱 Mobile Optimization Features

### Performance
- **Lazy Loading** - Images load on-demand
- **Thumbnail Optimization** - Smaller preview images
- **Smooth Scrolling** - Hardware-accelerated
- **Touch Events** - Native mobile gestures

### UI/UX
- **Bottom Sheet** - Familiar mobile pattern
- **Large Touch Targets** - 48px minimum
- **No Scroll Jacking** - Preserves chat scroll
- **Viewport-Aware** - Adapts to screen size

### Responsive Design
- **Phone** - 80vh panel, 60px thumbnails
- **Tablet** - 70vh panel, 70px thumbnails  
- **Desktop** - 70vh panel, 80px thumbnails

## 🔄 Updating

### GitHub Method
1. Extensions panel
2. Check for updates button
3. Update if available

### Manual Method
1. Download latest version
2. Replace files in `mobile-gallery` folder
3. Restart SillyTavern

## ⚖️ License

MIT License - Free to use, modify, and distribute

## 🙏 Credits

- **Created by:** J7CKP0T
- **Inspired by:** Need for better mobile gallery access
- **Built for:** SillyTavern community

## 📞 Support

### Getting Help

**Issues:**
- GitHub: [Report Issue](https://github.com/J7CKP0T/QuickGalleryExtension-Mobile/issues)
- Discord: SillyTavern server #extensions

**Documentation:**
- ST Docs: https://docs.sillytavern.app/
- Extension Guide: https://docs.sillytavern.app/for-contributors/writing-extensions/

## 🔮 Future Features

Planned improvements:
- [ ] Fullscreen mode
- [ ] Image zoom/pan
- [ ] Slideshow mode
- [ ] Image sharing
- [ ] Swipe gestures for navigation
- [ ] Grid view toggle
- [ ] Image search/filter
- [ ] Multiple selection
- [ ] Image upload directly from gallery

## 📝 Changelog

### v1.0.0 (Initial Release)
- Floating button with customizable position
- Slide-in panel from bottom
- Thumbnail strip navigation
- Main image viewer
- Arrow navigation
- Caption display
- Settings panel
- Auto-refresh on character change
- Mobile-optimized design
- Theme compatibility

---

**Enjoy your mobile-optimized gallery! 🎉**

*If you find this extension useful, consider starring the repository!*
