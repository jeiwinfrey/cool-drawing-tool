/**
 * Canvas Manager
 * 
 * Handles all direct canvas operations including:
 * 1. Drawing tools (pen, eraser)
 * 2. Shape tools (rectangle, circle, triangle)
 * 3. Canvas properties (size, color, opacity)
 * 4. Canvas state management
 */
export class CanvasManager {
    /**
     * Initializes the canvas manager
     * @param {string} canvasId - ID of the canvas element
     */
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.color = '#000000';
        this.brushSize = 5;
        this.opacity = 1;
        this.lastX = 0;
        this.lastY = 0;
        this.startX = 0;
        this.startY = 0;
        this.setupCanvas();
    }

    /**
     * Sets up the canvas and adds resize listener
     */
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resizes canvas to match container size
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    /**
     * Starts a drawing operation
     * For shapes, saves the current canvas state for preview
     * @param {MouseEvent} e - Mouse event
     */
    startDrawing(e) {
        this.isDrawing = true;
        [this.lastX, this.lastY] = this.getMousePos(e);
        [this.startX, this.startY] = [this.lastX, this.lastY];
        
        // Store canvas state for shape preview
        if (this.isShapeTool()) {
            this.savedImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Handles drawing operation based on selected tool
     * @param {MouseEvent} e - Mouse event
     * @returns {Array} Current mouse position
     */
    draw(e) {
        if (!this.isDrawing) return;

        const [x, y] = this.getMousePos(e);
        
        if (this.isShapeTool()) {
            // Restore canvas to remove previous shape preview
            if (this.savedImageData) {
                this.ctx.putImageData(this.savedImageData, 0, 0);
            }
            
            // Draw shape preview
            this.ctx.beginPath();
            this.ctx.globalAlpha = this.opacity;
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.brushSize;
            
            switch (this.currentTool) {
                case 'rectangle':
                    this.drawRectangle(this.startX, this.startY, x - this.startX, y - this.startY);
                    break;
                case 'circle':
                    this.drawCircle(this.startX, this.startY, x, y);
                    break;
                case 'triangle':
                    this.drawTriangle(this.startX, this.startY, x, y);
                    break;
            }
            
            this.ctx.stroke();
        } else {
            // Free-hand drawing
            this.ctx.beginPath();
            this.ctx.globalAlpha = this.opacity;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.lineWidth = this.brushSize;
            this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#ffffff' : this.color;
            
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }

        this.lastX = x;
        this.lastY = y;
        return [x, y];
    }

    /**
     * Draws a rectangle
     * @param {number} x - Start X coordinate
     * @param {number} y - Start Y coordinate
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     */
    drawRectangle(x, y, width, height) {
        this.ctx.rect(x, y, width, height);
    }

    /**
     * Draws a circle
     * @param {number} startX - Center X coordinate
     * @param {number} startY - Center Y coordinate
     * @param {number} endX - End X coordinate (for radius calculation)
     * @param {number} endY - End Y coordinate (for radius calculation)
     */
    drawCircle(startX, startY, endX, endY) {
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    }

    /**
     * Draws a triangle
     * @param {number} startX - Start X coordinate
     * @param {number} startY - Start Y coordinate
     * @param {number} endX - End X coordinate
     * @param {number} endY - End Y coordinate
     */
    drawTriangle(startX, startY, endX, endY) {
        const height = endY - startY;
        const width = endX - startX;
        
        this.ctx.moveTo(startX, startY + height);
        this.ctx.lineTo(startX + width/2, startY);
        this.ctx.lineTo(startX + width, startY + height);
        this.ctx.closePath();
    }

    /**
     * Ends the current drawing operation
     */
    endDrawing() {
        this.isDrawing = false;
        this.savedImageData = null;
    }

    /**
     * Gets mouse position relative to canvas
     * @param {MouseEvent} e - Mouse event
     * @returns {Array} [x, y] coordinates
     */
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }

    /**
     * Checks if current tool is a shape tool
     * @returns {boolean} True if current tool is a shape tool
     */
    isShapeTool() {
        return ['rectangle', 'circle', 'triangle'].includes(this.currentTool);
    }

    // Tool and property setters
    setTool(tool) { this.currentTool = tool; }
    setColor(color) { this.color = color; }
    setBrushSize(size) { this.brushSize = size; }
    setOpacity(opacity) { this.opacity = opacity; }

    // Canvas state methods
    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    loadImageData(imageData) {
        this.ctx.putImageData(imageData, 0, 0);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
