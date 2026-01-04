/**
 * Quick Gallery Extension for SillyTavern
 * Provides easy access to character gallery from chat interface
 */

(function() {
    'use strict';

    const MODULE_NAME = 'quick_gallery';
    let galleryButton = null;
    let galleryModal = null;
    let currentImages = [];
    let context = null;
    let eventSource = null;

    /**
     * Initialize the extension
     */
    jQuery(async () => {
        // Wait for SillyTavern to be ready
        while (!window.SillyTavern || !window.SillyTavern.getContext) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        await init();
    });

    async function init() {
        console.log('[Quick Gallery] Initializing extension');
        
        // Get SillyTavern context
        context = SillyTavern.getContext();
        eventSource = context.eventSource;
        
        // Setup extension UI
        setupExtension();
        registerEventListeners();
        
        console.log('[Quick Gallery] Extension initialized successfully');
    }

    /**
     * Setup the extension UI
     */
    function setupExtension() {
        createGalleryButton();
        createGalleryModal();
    }

    /**
     * Create the floating gallery button
     */
    function createGalleryButton() {
        if (galleryButton) return;

        galleryButton = document.createElement('div');
        galleryButton.id = 'quick-gallery-btn';
        galleryButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        `;
        galleryButton.title = 'Open Gallery';
        
        galleryButton.addEventListener('click', openGallery);
        document.body.appendChild(galleryButton);
    }

    /**
     * Create the gallery modal
     */
    function createGalleryModal() {
        if (galleryModal) return;

        galleryModal = document.createElement('div');
        galleryModal.id = 'quick-gallery-modal';
        galleryModal.className = 'quick-gallery-hidden';
        
        galleryModal.innerHTML = `
            <div class="quick-gallery-overlay"></div>
            <div class="quick-gallery-container">
                <div class="quick-gallery-header">
                    <h3 class="quick-gallery-title">Character Gallery</h3>
                    <button class="quick-gallery-close" title="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="quick-gallery-content">
                    <div class="quick-gallery-grid" id="quick-gallery-grid"></div>
                    <div class="quick-gallery-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <p>No images in gallery</p>
                    </div>
                </div>
            </div>
            <div class="quick-gallery-viewer quick-gallery-hidden">
                <button class="quick-gallery-viewer-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <button class="quick-gallery-nav quick-gallery-nav-prev">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <img src="" alt="" class="quick-gallery-viewer-img">
                <button class="quick-gallery-nav quick-gallery-nav-next">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
                <div class="quick-gallery-viewer-counter"></div>
            </div>
        `;

        document.body.appendChild(galleryModal);
        
        // Setup modal events
        setupModalEvents();
    }

    /**
     * Setup modal event listeners
     */
    function setupModalEvents() {
        const closeBtn = galleryModal.querySelector('.quick-gallery-close');
        closeBtn.addEventListener('click', closeGallery);

        const overlay = galleryModal.querySelector('.quick-gallery-overlay');
        overlay.addEventListener('click', closeGallery);

        const viewerClose = galleryModal.querySelector('.quick-gallery-viewer-close');
        viewerClose.addEventListener('click', closeViewer);

        const prevBtn = galleryModal.querySelector('.quick-gallery-nav-prev');
        prevBtn.addEventListener('click', () => navigateImage(-1));

        const nextBtn = galleryModal.querySelector('.quick-gallery-nav-next');
        nextBtn.addEventListener('click', () => navigateImage(1));
    }

    /**
     * Register event listeners
     */
    function registerEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyPress);

        // Listen for character changes using SillyTavern's event system
        if (eventSource && eventSource.on) {
            eventSource.on(event_types.CHAT_CHANGED, () => {
                console.log('[Quick Gallery] Chat changed, refreshing gallery');
            });
            
            eventSource.on(event_types.CHARACTER_EDITED, () => {
                console.log('[Quick Gallery] Character edited, refreshing gallery');
            });
        }
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeyPress(e) {
        const viewer = galleryModal.querySelector('.quick-gallery-viewer');
        if (!viewer.classList.contains('quick-gallery-hidden')) {
            if (e.key === 'Escape') closeViewer();
            if (e.key === 'ArrowLeft') navigateImage(-1);
            if (e.key === 'ArrowRight') navigateImage(1);
        } else if (!galleryModal.classList.contains('quick-gallery-hidden')) {
            if (e.key === 'Escape') closeGallery();
        }
    }

    /**
     * Open the gallery modal
     */
    async function openGallery() {
        await loadCharacterGallery();
        galleryModal.classList.remove('quick-gallery-hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the gallery modal
     */
    function closeGallery() {
        galleryModal.classList.add('quick-gallery-hidden');
        document.body.style.overflow = '';
    }

    /**
     * Load images from character gallery
     */
    async function loadCharacterGallery() {
        const grid = document.getElementById('quick-gallery-grid');
        const emptyState = galleryModal.querySelector('.quick-gallery-empty');
        
        grid.innerHTML = '';
        currentImages = [];

        if (!context || (!context.characterId && !context.groupId)) {
            emptyState.style.display = 'flex';
            return;
        }

        try {
            const char = context.characters[context.characterId];
            if (!char || !char.avatar) {
                emptyState.style.display = 'flex';
                return;
            }

            // Extract character name from avatar path
            // Avatar format is typically: characters/CharacterName/avatar.png
            const avatarPath = char.avatar;
            const charNameMatch = avatarPath.match(/characters\/([^\/]+)\//);
            
            if (!charNameMatch) {
                console.error('[Quick Gallery] Could not extract character name from avatar path');
                emptyState.style.display = 'flex';
                return;
            }

            const charName = charNameMatch[1];
            console.log('[Quick Gallery] Loading gallery for character:', charName);

            // Try to fetch images using SillyTavern's API
            const response = await fetch(`/api/characters/get?name=${encodeURIComponent(charName)}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch character data: ${response.status}`);
            }

            const charData = await response.json();
            
            // Look for gallery data in character extensions
            if (charData.data && charData.data.extensions && charData.data.extensions.gallery) {
                const gallery = charData.data.extensions.gallery;
                
                if (Array.isArray(gallery) && gallery.length > 0) {
                    currentImages = gallery.map(img => {
                        // Convert to full path if needed
                        if (img.startsWith('http')) {
                            return img;
                        } else if (img.startsWith('characters/')) {
                            return `/${img}`;
                        } else {
                            return `/characters/${charName}/${img}`;
                        }
                    });
                }
            }

            // Display results
            if (currentImages.length > 0) {
                emptyState.style.display = 'none';
                
                currentImages.forEach((img, index) => {
                    const imgCard = document.createElement('div');
                    imgCard.className = 'quick-gallery-item';
                    
                    const imgEl = document.createElement('img');
                    imgEl.src = img;
                    imgEl.alt = `Gallery image ${index + 1}`;
                    imgEl.loading = 'lazy';
                    
                    imgEl.onerror = function() {
                        console.error('[Quick Gallery] Failed to load image:', img);
                        imgCard.style.display = 'none';
                    };
                    
                    imgCard.appendChild(imgEl);
                    imgCard.addEventListener('click', () => openViewer(index));
                    grid.appendChild(imgCard);
                });
            } else {
                emptyState.style.display = 'flex';
            }
        } catch (error) {
            console.error('[Quick Gallery] Error loading images:', error);
            emptyState.style.display = 'flex';
        }
    }

    /**
     * Open image viewer
     */
    function openViewer(index) {
        if (index < 0 || index >= currentImages.length) return;

        const viewer = galleryModal.querySelector('.quick-gallery-viewer');
        const img = viewer.querySelector('.quick-gallery-viewer-img');
        const counter = viewer.querySelector('.quick-gallery-viewer-counter');

        img.src = currentImages[index];
        img.dataset.index = index;
        counter.textContent = `${index + 1} / ${currentImages.length}`;

        viewer.classList.remove('quick-gallery-hidden');
    }

    /**
     * Close image viewer
     */
    function closeViewer() {
        const viewer = galleryModal.querySelector('.quick-gallery-viewer');
        viewer.classList.add('quick-gallery-hidden');
    }

    /**
     * Navigate between images
     */
    function navigateImage(direction) {
        const img = galleryModal.querySelector('.quick-gallery-viewer-img');
        const currentIndex = parseInt(img.dataset.index || '0');
        let newIndex = currentIndex + direction;

        // Loop around
        if (newIndex < 0) newIndex = currentImages.length - 1;
        if (newIndex >= currentImages.length) newIndex = 0;

        openViewer(newIndex);
    }
})();
