/**
 * Provides a draggable editor that follows the user's viewport, solving the issue
 * of the fact the editor box jumps back to the start when the user is typing. 
 * This second box avoids that issue entirely
 */
const initializeDynamicShadowBox = () => {
    let currentEditor = null;

    // Using a separate floating div instead of position:sticky because we need
    // it to remain accessible regardless of parent container overflow settings
    const shadowBox = document.createElement('div');
    shadowBox.contentEditable = true;
    shadowBox.style.cssText = `
        position: fixed;
        bottom: 50px; /* Positioned above potential bottom navigation/toolbars */
        left: 10px;
        width: 300px;
        height: auto;
        max-height: 200px;
        overflow-y: auto;
        background: #1e1e2e; /* Using Catppuccin theme for better visibility in both light/dark modes */
        color: #cdd6f4; /* Light text color */
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.4;
        z-index: 9999;
        border: 1px solid #6c7086; /* Subtle border color */
        white-space: pre-wrap;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); /* Elegant shadow effect */
        cursor: grab; /* Indicate draggable behavior */
    `;
    document.body.appendChild(shadowBox);

    // Track mouse position relative to the box to maintain the same grab point during drag
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    shadowBox.addEventListener('mousedown', (event) => {
        isDragging = true;
        offsetX = event.clientX - shadowBox.getBoundingClientRect().left;
        offsetY = event.clientY - shadowBox.getBoundingClientRect().top;
        shadowBox.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;

        // Constrain to viewport to prevent the editor from being dragged off-screen
        const x = Math.max(0, Math.min(event.clientX - offsetX, window.innerWidth - shadowBox.offsetWidth));
        const y = Math.max(0, Math.min(event.clientY - offsetY, window.innerHeight - shadowBox.offsetHeight));
        
        shadowBox.style.left = `${x}px`;
        shadowBox.style.top = `${y}px`;
        shadowBox.style.bottom = 'auto'; // Override initial bottom position to allow free movement
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            shadowBox.style.cursor = 'grab';
        }
    });

    /**
     * Some frameworks require both input and keydown events to detect changes.
     * This ensures compatibility across different event handling implementations.
     */
    const simulateTypingEvent = (element) => {
        if (!element) return;
        
        try {
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
            const keyEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'a' });
            element.dispatchEvent(keyEvent);
        } catch (error) {
            console.warn('Event simulation failed:', error);
        }
    };

    /**
     * Changes in the floating editor need to trigger framework-specific change detection
     * to ensure the main editor's state stays in sync with the application
     */
    const syncToEditor = () => {
        if (!currentEditor) return;
        
        try {
            currentEditor.textContent = shadowBox.textContent;
            simulateTypingEvent(currentEditor);
        } catch (error) {
            console.warn('Sync to editor failed:', error);
        }
    };

    /**
     * Mirror content to shadow box immediately on focus to prevent
     * user confusion about which content they're editing
     */
    const syncToShadowBox = () => {
        if (!currentEditor) return;
        
        try {
            shadowBox.textContent = currentEditor.textContent;
        } catch (error) {
            console.warn('Sync to shadow box failed:', error);
        }
    };

    // Only sync with elements that are explicitly marked as content editors
    // to avoid interfering with other contenteditable elements on the page
    document.addEventListener('focusin', (event) => {
        const target = event.target;
        if (!target) return;

        if (target.matches('[data-testid="content-editor"][contenteditable="true"]')) {
            currentEditor = target;
            syncToShadowBox();
        }
    });

    // Maintain two-way binding to ensure content stays synchronized regardless
    // of which editor the user is typing in
    shadowBox.addEventListener('input', syncToEditor);
    document.addEventListener('input', (event) => {
        if (event.target === currentEditor) {
            syncToShadowBox();
        }
    });

    console.log("Floating editor initialized with improved bounds checking and error handling");
};

// Start the floating editor system
initializeDynamicShadowBox();
