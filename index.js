/**
 * Mobile Gallery Extension for SillyTavern
 * Mobile-optimized floating gallery viewer with slide-in panel
 * @author J7CKP0T
 * @version 1.0.0
 */

(async function() {
    'use strict';

    const extensionName = 'mobile-gallery';
    const extensionFolderPath = `scripts/extensions/third-party/${extensionName}/`;
    
    // Extension settings with defaults
    let settings = {
        enabled: true,
        buttonPosition: 'bottom-right',
        buttonSize: 'medium',
        panelPosition: 'bottom',
        showCaptions: true,
        autoLoad: true,
        imageQuality: 'high'
    };

    let galleryImages = [];
    let currentImageIndex = 0;
    let isOpen = false;
    
    /**
     * Load settings from extension storage
     */
    function loadSettings() {
        const savedSettings = extension_settings[extensionName];
        if (savedSettings) {
            Object.assign(settings, savedSettings);
        }
    }

    /**
     * Save settings to extension storage
     */
    function saveSettings() {
        extension_settings[extensionName] = settings;
        saveSettingsDebounced();
    }

    /**
     * Create and inject the floating button
     */
    function createFloatingButton() {
        const button = $(`
            <button id="mobile-gallery-button" class="mobile-gallery-fab ${settings.buttonPosition} ${settings.buttonSize}" title="Open Gallery">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            </button>
        `);

        button.on('click', toggleGallery);
        $('body').append(button);
        
        return button;
    }

    /**
     * Create the slide-in gallery panel
     */
    function createGalleryPanel() {
        const panel = $(`
            <div id="mobile-gallery-panel" class="mobile-gallery-panel ${settings.panelPosition}">
                <div class="mobile-gallery-header">
                    <div class="mobile-gallery-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Gallery</span>
                        <span class="mobile-gallery-count">(0)</span>
                    </div>
                    <button class="mobile-gallery-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <div class="mobile-gallery-thumbnails">
                    <div class="mobile-gallery-thumbnails-scroll"></div>
                </div>
                
                <div class="mobile-gallery-viewer">
                    <div class="mobile-gallery-viewer-container">
                        <img class="mobile-gallery-viewer-img" src="" alt="">
                        <button class="mobile-gallery-nav mobile-gallery-nav-prev">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"/>
                            </svg>
                        </button>
                        <button class="mobile-gallery-nav mobile-gallery-nav-next">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"/>
                            </svg>
                        </button>
                    </div>
                    <div class="mobile-gallery-caption"></div>
                    <div class="mobile-gallery-counter">
                        <span class="current">1</span> / <span class="total">1</span>
                    </div>
                </div>
                
                <div class="mobile-gallery-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>No images available</p>
                    <span class="mobile-gallery-empty-sub">Images will appear here when a character has a gallery</span>
                </div>
            </div>
        `);

        // Event listeners
        panel.find('.mobile-gallery-close').on('click', closeGallery);
        panel.find('.mobile-gallery-nav-prev').on('click', () => navigateImage(-1));
        panel.find('.mobile-gallery-nav-next').on('click', () => navigateImage(1));

        $('body').append(panel);
        return panel;
    }

    /**
     * Toggle gallery open/closed
     */
    function toggleGallery() {
        if (isOpen) {
            closeGallery();
        } else {
            openGallery();
        }
    }

    /**
     * Open the gallery
     */
    async function openGallery() {
        const panel = $('#mobile-gallery-panel');
        await loadGalleryImages();
        
        panel.addClass('open');
        $('#mobile-gallery-button').addClass('active');
        isOpen = true;

        // Prevent body scroll on mobile
        $('body').addClass('mobile-gallery-no-scroll');
    }

    /**
     * Close the gallery
     */
    function closeGallery() {
        const panel = $('#mobile-gallery-panel');
        panel.removeClass('open');
        $('#mobile-gallery-button').removeClass('active');
        isOpen = false;

        // Restore body scroll
        $('body').removeClass('mobile-gallery-no-scroll');
    }

    /**
     * Load images for current character
     */
    async function loadGalleryImages() {
        const context = SillyTavern.getContext();
        
        if (!context.characterId && !context.groupId) {
            showEmptyState();
            return;
        }

        const character = context.characters[context.characterId];
        if (!character) {
            showEmptyState();
            return;
        }

        try {
            // Get character name from avatar path
            const avatarMatch = character.avatar.match(/characters\/([^\/]+)\//);
            if (!avatarMatch) {
                console.error('[Mobile Gallery] Could not parse character name');
                showEmptyState();
                return;
            }

            const charName = avatarMatch[1];
            
            // Fetch character data to get gallery
            const response = await fetch(`/api/characters/get?name=${encodeURIComponent(charName)}`);
            if (!response.ok) throw new Error('Failed to fetch character');

            const charData = await response.json();
            const gallery = charData.data?.extensions?.gallery || [];

            if (gallery.length === 0) {
                showEmptyState();
                return;
            }

            // Process gallery images
            galleryImages = gallery.map(img => {
                if (img.startsWith('http')) return img;
                if (img.startsWith('characters/')) return `/${img}`;
                return `/characters/${charName}/${img}`;
            });

            renderGallery();
        } catch (error) {
            console.error('[Mobile Gallery] Error loading images:', error);
            showEmptyState();
        }
    }

    /**
     * Render the gallery thumbnails and viewer
     */
    function renderGallery() {
        const panel = $('#mobile-gallery-panel');
        const scroll = panel.find('.mobile-gallery-thumbnails-scroll');
        
        scroll.empty();
        
        galleryImages.forEach((img, index) => {
            const thumb = $(`
                <div class="mobile-gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${img}" alt="Image ${index + 1}">
                </div>
            `);
            
            thumb.on('click', () => showImage(index));
            scroll.append(thumb);
        });

        panel.find('.mobile-gallery-count').text(`(${galleryImages.length})`);
        panel.find('.mobile-gallery-empty').hide();
        panel.find('.mobile-gallery-thumbnails, .mobile-gallery-viewer').show();

        showImage(0);
    }

    /**
     * Show specific image in viewer
     */
    function showImage(index) {
        if (index < 0 || index >= galleryImages.length) return;

        currentImageIndex = index;
        const panel = $('#mobile-gallery-panel');
        
        // Update viewer image
        panel.find('.mobile-gallery-viewer-img').attr('src', galleryImages[index]);
        
        // Update counter
        panel.find('.mobile-gallery-counter .current').text(index + 1);
        panel.find('.mobile-gallery-counter .total').text(galleryImages.length);
        
        // Update caption
        if (settings.showCaptions) {
            const filename = galleryImages[index].split('/').pop();
            panel.find('.mobile-gallery-caption').text(filename).show();
        } else {
            panel.find('.mobile-gallery-caption').hide();
        }
        
        // Update active thumbnail
        panel.find('.mobile-gallery-thumb').removeClass('active');
        panel.find(`.mobile-gallery-thumb[data-index="${index}"]`).addClass('active');
        
        // Scroll thumbnail into view
        const activeThumb = panel.find(`.mobile-gallery-thumb[data-index="${index}"]`)[0];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Update nav button states
        panel.find('.mobile-gallery-nav-prev').prop('disabled', index === 0);
        panel.find('.mobile-gallery-nav-next').prop('disabled', index === galleryImages.length - 1);
    }

    /**
     * Navigate to next/previous image
     */
    function navigateImage(direction) {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < galleryImages.length) {
            showImage(newIndex);
        }
    }

    /**
     * Show empty state
     */
    function showEmptyState() {
        const panel = $('#mobile-gallery-panel');
        gallery Images = [];
        panel.find('.mobile-gallery-count').text('(0)');
        panel.find('.mobile-gallery-thumbnails, .mobile-gallery-viewer').hide();
        panel.find('.mobile-gallery-empty').show();
    }

    /**
     * Add settings UI to extension panel
     */
    function addSettingsUI() {
        const settingsHtml = `
            <div class="mobile-gallery-settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>Mobile Gallery Settings</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <label class="checkbox_label">
                            <input type="checkbox" id="mobile_gallery_enabled" ${settings.enabled ? 'checked' : ''}>
                            <span>Enable Mobile Gallery</span>
                        </label>
                        
                        <label for="mobile_gallery_button_position">Button Position:</label>
                        <select id="mobile_gallery_button_position" class="text_pole">
                            <option value="bottom-right" ${settings.buttonPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                            <option value="bottom-left" ${settings.buttonPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                            <option value="top-right" ${settings.buttonPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                            <option value="top-left" ${settings.buttonPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                        </select>
                        
                        <label for="mobile_gallery_button_size">Button Size:</label>
                        <select id="mobile_gallery_button_size" class="text_pole">
                            <option value="small" ${settings.buttonSize === 'small' ? 'selected' : ''}>Small</option>
                            <option value="medium" ${settings.buttonSize === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="large" ${settings.buttonSize === 'large' ? 'selected' : ''}>Large</option>
                        </select>
                        
                        <label class="checkbox_label">
                            <input type="checkbox" id="mobile_gallery_show_captions" ${settings.showCaptions ? 'checked' : ''}>
                            <span>Show Image Captions</span>
                        </label>
                        
                        <label class="checkbox_label">
                            <input type="checkbox" id="mobile_gallery_auto_load" ${settings.autoLoad ? 'checked' : ''}>
                            <span>Auto-load on Character Change</span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        $('#extensions_settings2').append(settingsHtml);

        // Event listeners for settings
        $('#mobile_gallery_enabled').on('change', function() {
            settings.enabled = $(this).prop('checked');
            $('#mobile-gallery-button').toggle(settings.enabled);
            saveSettings();
        });

        $('#mobile_gallery_button_position').on('change', function() {
            const oldPos = settings.buttonPosition;
            settings.buttonPosition = $(this).val();
            $('#mobile-gallery-button').removeClass(oldPos).addClass(settings.buttonPosition);
            saveSettings();
        });

        $('#mobile_gallery_button_size').on('change', function() {
            const oldSize = settings.buttonSize;
            settings.buttonSize = $(this).val();
            $('#mobile-gallery-button').removeClass(oldSize).addClass(settings.buttonSize);
            saveSettings();
        });

        $('#mobile_gallery_show_captions').on('change', function() {
            settings.showCaptions = $(this).prop('checked');
            saveSettings();
        });

        $('#mobile_gallery_auto_load').on('change', function() {
            settings.autoLoad = $(this).prop('checked');
            saveSettings();
        });
    }

    /**
     * Initialize the extension
     */
    async function init() {
        console.log('[Mobile Gallery] Initializing extension');
        
        loadSettings();
        createFloatingButton();
        createGalleryPanel();
        addSettingsUI();

        // Listen for character changes
        eventSource.on(event_types.CHAT_CHANGED, () => {
            if (settings.autoLoad && isOpen) {
                loadGalleryImages();
            }
        });

        eventSource.on(event_types.CHARACTER_EDITED, () => {
            if (settings.autoLoad && isOpen) {
                loadGalleryImages();
            }
        });

        // Hide button if disabled
        if (!settings.enabled) {
            $('#mobile-gallery-button').hide();
        }

        console.log('[Mobile Gallery] Extension initialized');
    }

    // Wait for SillyTavern to be ready, then initialize
    jQuery(async () => {
        await init();
    });

})();
