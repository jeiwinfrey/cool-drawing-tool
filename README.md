# Vanilla Drawing Tool

A simple and intuitive drawing tool built with vanilla JavaScript that supports:
- Free-hand drawing with customizable brush size and opacity
- Shape tools (Rectangle, Circle, Triangle)
- Eraser tool
- Undo/Redo functionality
- Export to JPEG and MP4
- Drawing history with replay feature
- Watermark support

## Features

### Drawing Tools
- Pen tool with customizable color, size, and opacity
- Eraser tool
- Shape tools: Rectangle, Circle, Triangle

### History Management
- Undo/Redo support
- Full drawing history with replay feature
- State-based history management

### Export Options
- Export as JPEG with optional background
- Export as MP4 animation showing drawing process
- Automatic watermark addition

### Installation
- Download the live server extension for your code editor

## Usage

1. Open `index.html` in a modern web browser
2. Select your desired tool from the toolbar
3. Customize brush size, color, and opacity using the controls
4. Draw on the canvas
5. Use the history controls to undo/redo or replay your drawing
6. Export your artwork as JPEG or MP4 when finished

## Implementation Details

The application is built using vanilla JavaScript with a focus on modularity and clean code:

- `app.js`: Main application logic and event handling
- `canvasManager.js`: Canvas operations and drawing functionality
- `drawingStateManager.js`: State management for undo/redo and history
- `stack.js`: Stack data structure for undo/redo operations
- `queue.js`: Queue data structure for replay functionality
- `history.js`: History list implementation

## Browser Support

Tested and supported in modern versions of:
- Chrome
- Firefox
- Safari
- Edge
