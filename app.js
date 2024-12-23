/**
 * Main Drawing Application
 * 
 * Program Flow:
 * 1. When the page loads, DrawingApp is initialized
 * 2. DrawingApp creates instances of CanvasManager (handles drawing) and DrawingStateManager (handles history/state)
 * 3. Event listeners are set up for:
 *    - Mouse events (draw, erase, shapes)
 *    - Tool selection (pen, eraser, shapes)
 *    - Drawing properties (color, size, opacity)
 *    - History actions (undo, redo, clear, replay)
 * 4. User interactions trigger appropriate methods in CanvasManager and DrawingStateManager
 * 5. Each drawing action is:
 *    a. Captured by event listeners
 *    b. Processed by CanvasManager for drawing
 *    c. Stored by DrawingStateManager for history
 */

import { CanvasManager } from './canvasManager.js';
import { DrawingStateManager } from './drawingStateManager.js';

class DrawingApp {
    /**
     * Initializes the drawing application
     * Creates instances of CanvasManager and DrawingStateManager
     * Sets up all event listeners
     */
    constructor() {
        this.canvasManager = new CanvasManager('drawingCanvas');
        this.stateManager = new DrawingStateManager(this.canvasManager);
        this.setupEventListeners();
        this.setupToolButtons();
    }

    /**
     * Sets up the tool selection buttons
     * Manages the active state of tools and their functionality
     */
    setupToolButtons() {
        // Function to remove active class from all tools
        const removeActiveClass = () => {
            document.querySelectorAll('.tool-group button').forEach(btn => {
                btn.classList.remove('active');
            });
        };

        // Get all tool button elements
        const penTool = document.getElementById('penTool');
        const eraserTool = document.getElementById('eraserTool');
        const rectangleTool = document.getElementById('rectangleTool');
        const circleTool = document.getElementById('circleTool');
        const triangleTool = document.getElementById('triangleTool');

        // Define all available tools and their properties
        const tools = [
            { el: penTool, name: 'brush' },
            { el: eraserTool, name: 'eraser' },
            { el: rectangleTool, name: 'rectangle' },
            { el: circleTool, name: 'circle' },
            { el: triangleTool, name: 'triangle' }
        ];

        // Set up click handlers for each tool
        tools.forEach(tool => {
            if (tool.el) {
                tool.el.addEventListener('click', () => {
                    removeActiveClass();
                    tool.el.classList.add('active');
                    this.canvasManager.setTool(tool.name);
                });
            }
        });

        // Set pen tool as initially active
        penTool.classList.add('active');
    }

    /**
     * Sets up all event listeners for the application
     * Includes drawing events, tool controls, and history actions
     */
    setupEventListeners() {
        const canvas = this.canvasManager.canvas;
        
        // Drawing events
        canvas.addEventListener('mousedown', (e) => {
            this.canvasManager.startDrawing(e);
            const point = this.canvasManager.getMousePos(e);
            this.stateManager.startStroke(point);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (this.canvasManager.isDrawing) {
                const point = this.canvasManager.draw(e);
                if (point) {
                    this.stateManager.addToStroke(point);
                }
            }
        });

        canvas.addEventListener('mouseup', () => {
            if (this.canvasManager.isDrawing) {
                this.canvasManager.endDrawing();
                this.stateManager.endStroke();
            }
        });

        canvas.addEventListener('mouseout', () => {
            if (this.canvasManager.isDrawing) {
                this.canvasManager.endDrawing();
                this.stateManager.endStroke();
            }
        });

        // Color picker events
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.addEventListener('input', () => {
            this.canvasManager.setColor(colorPicker.value);
        });
        colorPicker.addEventListener('change', () => {
            this.canvasManager.setColor(colorPicker.value);
        });

        // Brush size control
        const brushSize = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        brushSize.addEventListener('input', () => {
            const size = brushSize.value;
            this.canvasManager.setBrushSize(size);
            brushSizeValue.textContent = size;
        });

        // Opacity control
        const opacity = document.getElementById('brushOpacity');
        const opacityValue = document.getElementById('brushOpacityValue');
        opacity.addEventListener('input', () => {
            const value = opacity.value / 100;
            this.canvasManager.setOpacity(value);
            opacityValue.textContent = opacity.value + '%';
        });

        // History control buttons
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.stateManager.undo();
        });

        document.getElementById('redoBtn').addEventListener('click', () => {
            this.stateManager.redo();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.stateManager.clear();
        });

        document.getElementById('replayBtn').addEventListener('click', () => {
            this.stateManager.replayStrokes();
        });

        // Export functionality
        const exportBtn = document.getElementById('exportBtn');
        const exportModal = document.getElementById('exportModal');
        const closeModal = document.getElementById('closeModal');
        const exportJpeg = document.getElementById('exportJpeg');
        const exportMp4 = document.getElementById('exportGif'); // Reuse the button
        const filenameInput = document.getElementById('exportFilename');
        const includeBackground = document.getElementById('includeBackground');

        const addWatermark = (ctx, width, height) => {
            ctx.save();
            ctx.font = '12px "Architects Daughter"';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            const text = 'made with ♥ by jeiwinfrey';
            const metrics = ctx.measureText(text);
            ctx.fillText(text, width - metrics.width - 10, height - 10);
            ctx.restore();
        };

        const createExportCanvas = (includeBackground) => {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = canvas.width;
            exportCanvas.height = canvas.height;
            const ctx = exportCanvas.getContext('2d');
            
            if (includeBackground) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(canvas, 0, 0);
            addWatermark(ctx, canvas.width, canvas.height);
            return exportCanvas;
        };

        exportBtn.addEventListener('click', () => {
            exportModal.style.display = 'block';
            filenameInput.value = 'drawing';
        });

        closeModal.addEventListener('click', () => {
            exportModal.style.display = 'none';
        });

        exportJpeg.addEventListener('click', () => {
            const filename = filenameInput.value || 'drawing';
            const exportCanvas = createExportCanvas(includeBackground.checked);
            const link = document.createElement('a');
            link.download = `${filename}.jpg`;
            link.href = exportCanvas.toDataURL('image/jpeg', 0.8);
            link.click();
            exportModal.style.display = 'none';
        });

        exportMp4.addEventListener('click', async () => {
            const frames = this.stateManager.getStrokes();
            if (frames.length === 0) {
                alert('No drawing history available for WebM export');
                return;
            }

            const filename = filenameInput.value || 'drawing';
            const videoCanvas = document.createElement('canvas');
            videoCanvas.width = canvas.width;
            videoCanvas.height = canvas.height;
            const ctx = videoCanvas.getContext('2d', { alpha: false });
            
            // Create MediaRecorder with supported codec
            const stream = videoCanvas.captureStream();
            let mediaRecorder;
            
            // Try different codecs
            const codecs = [
                'video/webm;codecs=h264',
                'video/webm;codecs=vp9',
                'video/webm;codecs=vp8',
                'video/webm'
            ];
            
            for (const codec of codecs) {
                if (MediaRecorder.isTypeSupported(codec)) {
                    mediaRecorder = new MediaRecorder(stream, {
                        mimeType: codec,
                        videoBitsPerSecond: 8000000 // 8 Mbps for better quality
                    });
                    break;
                }
            }
            
            if (!mediaRecorder) {
                alert('No supported video codec found. Try a different browser.');
                return;
            }

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${filename}.webm`;
                link.click();
                exportModal.style.display = 'none';
            };

            // Initialize canvas with background
            ctx.fillStyle = includeBackground.checked ? '#ffffff' : 'transparent';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Start recording
            mediaRecorder.start();

            let currentFrame = 0;
            const frameDelay = 50; // 20 FPS
            let currentStrokes = [];

            function drawNextFrame() {
                if (currentFrame >= frames.length) {
                    // Add final watermark
                    ctx.globalAlpha = 1;
                    addWatermark(ctx, canvas.width, canvas.height);
                    setTimeout(() => mediaRecorder.stop(), 500);
                    return;
                }

                // Get next stroke
                const stroke = frames[currentFrame];
                currentStrokes.push(stroke);

                // Clear canvas and redraw everything
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (includeBackground.checked) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                // Draw all strokes up to this point
                for (const s of currentStrokes) {
                    ctx.beginPath();
                    ctx.globalAlpha = s.opacity;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.lineWidth = s.width;
                    ctx.strokeStyle = s.tool === 'eraser' ? '#ffffff' : s.color;

                    if (['rectangle', 'circle', 'triangle'].includes(s.tool)) {
                        const startPoint = s.points[0];
                        const endPoint = s.points[s.points.length - 1];
                        
                        switch (s.tool) {
                            case 'rectangle':
                                ctx.rect(
                                    startPoint.x,
                                    startPoint.y,
                                    endPoint.x - startPoint.x,
                                    endPoint.y - startPoint.y
                                );
                                break;
                            case 'circle':
                                const radius = Math.sqrt(
                                    Math.pow(endPoint.x - startPoint.x, 2) +
                                    Math.pow(endPoint.y - startPoint.y, 2)
                                );
                                ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
                                break;
                            case 'triangle':
                                ctx.moveTo(startPoint.x, startPoint.y + (endPoint.y - startPoint.y));
                                ctx.lineTo(startPoint.x + (endPoint.x - startPoint.x)/2, startPoint.y);
                                ctx.lineTo(endPoint.x, endPoint.y);
                                ctx.closePath();
                                break;
                        }
                    } else {
                        // Draw freehand strokes
                        ctx.moveTo(s.points[0].x, s.points[0].y);
                        for (let i = 1; i < s.points.length; i++) {
                            const point = s.points[i];
                            ctx.lineTo(point.x, point.y);
                        }
                    }
                    ctx.stroke();
                }

                // Add watermark
                ctx.globalAlpha = 1;
                addWatermark(ctx, canvas.width, canvas.height);

                currentFrame++;
                setTimeout(drawNextFrame, frameDelay);
            }

            // Start the drawing process
            drawNextFrame();
        });        

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === exportModal) {
                exportModal.style.display = 'none';
            }
        });
    }

    /**
     * Jumps to a specific state in the drawing history
     * @param {number} id - The ID of the state to jump to
     */
    jumpToState(id) {
        this.stateManager.jumpToState(id);
    }
}

// Initialize the app when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.drawingApp = new DrawingApp();
});
