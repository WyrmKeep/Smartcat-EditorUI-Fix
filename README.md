# SmartCat Editor Fix

A simple fix for SmartCat's editor cursor jumping issue where the cursor keeps jumping to the start of the text while typing.

## The Problem
When typing in SmartCat's editor, the cursor randomly jumps back to the start of the text, making it impossible to type normally.

## The Solution
This script creates a floating editor box that syncs with SmartCat's original editor but doesn't have the cursor jumping issue. You can:
- Type normally without cursor jumps
- Drag the editor box anywhere on your screen
- Keep working as usual with all SmartCat features

## How to Use
1. Open SmartCat in your browser
2. Press F12 to open Developer Tools
3. Click on the "Console" tab
4. Copy the entire content of `Textboxfix.js`
5. Paste it into the console and press Enter
6. Start editing - a floating editor will appear when you click any editable field

Note: You'll need to do this each time you refresh the page or open a new SmartCat tab.

## Notes
- The floating editor stays in sync with SmartCat's original editor
- You can drag it anywhere on your screen
- It will stay within your viewport
- Works with SmartCat's validation and formatting
- Currently only tested on Google Chrome
