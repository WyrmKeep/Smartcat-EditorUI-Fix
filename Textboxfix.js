/**
 * Creates a floating editor that mirrors content from the main editor.
 */
const initializeDynamicShadowBox = () => {
    let currentEditor = null;

    // Create a floating editor that mirrors the main editor's content
    const shadowBox = document.createElement('div');
    shadowBox.contentEditable = true; // Make the shadow box editable
    shadowBox.style.cssText = `
        position: fixed;
        bottom: 50px; /* Adjusted position */
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

    // Implement drag functionality to allow repositioning the editor anywhere on screen
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
        if (isDragging) {
            const x = event.clientX - offsetX;
            const y = event.clientY - offsetY;
            shadowBox.style.left = `${x}px`;
            shadowBox.style.top = `${y}px`;
            shadowBox.style.bottom = 'auto'; // Remove bottom positioning for free movement
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            shadowBox.style.cursor = 'grab';
        }
    });

    /**
     * Triggers synthetic input events to ensure content changes are detected
     * by any external listeners or reactive frameworks
     */
    const simulateTypingEvent = (element) => {
        const inputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(inputEvent);

        const keyEvent = new KeyboardEvent('keydown', { bubbles: true, key: 'a' }); // Simulate any key
        element.dispatchEvent(keyEvent);
    };

    /**
     * Ensures changes in the floating editor are reflected in the main editor
     * and triggers necessary events for change detection
     */
    const syncToEditor = () => {
        if (currentEditor) {
            currentEditor.textContent = shadowBox.textContent; // Sync shadow box content into the current box
            simulateTypingEvent(currentEditor); // Trigger typing events to ensure detection
        }
    };

    /**
     * Updates the floating editor when changes occur in the main editor
     * to maintain content synchronization
     */
    const syncToShadowBox = () => {
        if (currentEditor) {
            shadowBox.textContent = currentEditor.textContent; // Sync current box content into the shadow box
        }
    };

    // Track the currently active editor to ensure proper synchronization
    document.addEventListener('focusin', (event) => {
        const target = event.target;

        // Check if the focused element is a valid contenteditable box
        if (target.matches('[data-testid="content-editor"][contenteditable="true"]')) {
            currentEditor = target; // Set the currently focused editor
            syncToShadowBox(); // Initialize shadow box with current editor's content
        }
    });

    // Maintain bidirectional sync between the floating and main editors
    shadowBox.addEventListener('input', syncToEditor); // Shadow box updates current editor
    document.addEventListener('input', (event) => {
        if (event.target === currentEditor) {
            syncToShadowBox(); // Current editor updates shadow box
        }
    });

    console.log("Floating editor initialized with bidirectional sync and drag functionality");
};

// Start the floating editor system
initializeDynamicShadowBox();
