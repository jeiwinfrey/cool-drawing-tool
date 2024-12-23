import { Stack } from './stack.js';
import { HistoryList } from './history.js';
import { Queue } from './queue.js';

export class DrawingStateManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.history = new HistoryList();
        this.undoStack = new Stack();
        this.redoStack = new Stack();
        this.replayQueue = new Queue();
        this.strokesArray = [];
        this.isReplaying = false;
        this.currentStroke = [];
        
        // Save initial state
        this.saveState();
    }

    saveState() {
        const imageData = this.canvasManager.getImageData();
        this.history.append(imageData);
        this.updateHistoryList();
        this.updateButtons();
    }

    undo() {
        const prevState = this.history.undo();
        if (prevState) {
            this.canvasManager.loadImageData(prevState.data);
            this.updateHistoryList();
            this.updateButtons();
        }
    }

    redo() {
        const nextState = this.history.redo();
        if (nextState) {
            this.canvasManager.loadImageData(nextState.data);
            this.updateHistoryList();
            this.updateButtons();
        }
    }

    jumpToState(id) {
        const state = this.history.moveTo(id);
        if (state) {
            this.canvasManager.loadImageData(state.data);
            this.updateHistoryList();
            this.updateButtons();
        }
    }

    clear() {
        if (this.isReplaying) {
            this.isReplaying = false;
        }
        this.canvasManager.clear();
        this.history.clear();
        this.strokesArray = [];
        this.saveState();
        this.updateHistoryList();
        this.updateButtons();
    }

    startStroke(point) {
        this.currentStroke = [point];
    }

    addToStroke(point) {
        this.currentStroke.push(point);
    }

    endStroke() {
        if (this.currentStroke.length > 0) {
            this.storeStroke(
                this.currentStroke,
                this.canvasManager.color,
                this.canvasManager.brushSize,
                this.canvasManager.opacity,
                this.canvasManager.currentTool
            );
            this.currentStroke = [];
            this.saveState();
        }
    }

    storeStroke(points, color, width, opacity, tool = 'brush') {
        this.strokesArray.push({
            points,
            color,
            width,
            opacity,
            tool
        });
    }

    getStrokes() {
        return this.strokesArray;
    }

    async replayStrokes() {
        if (this.isReplaying || this.strokesArray.length === 0) return;
        
        this.isReplaying = true;
        this.canvasManager.clear();

        for (const stroke of this.strokesArray) {
            if (!this.isReplaying) break;  // Stop if replay was cancelled

            // Set the drawing properties
            this.canvasManager.color = stroke.color;
            this.canvasManager.brushSize = stroke.width;
            this.canvasManager.opacity = stroke.opacity;
            this.canvasManager.currentTool = stroke.tool;

            // For shape tools, only draw the final shape
            if (['rectangle', 'circle', 'triangle'].includes(stroke.tool)) {
                const startPoint = stroke.points[0];
                const endPoint = stroke.points[stroke.points.length - 1];
                
                this.canvasManager.ctx.beginPath();
                this.canvasManager.ctx.globalAlpha = stroke.opacity;
                this.canvasManager.ctx.strokeStyle = stroke.color;
                this.canvasManager.ctx.lineWidth = stroke.width;

                switch (stroke.tool) {
                    case 'rectangle':
                        this.canvasManager.drawRectangle(
                            startPoint[0], startPoint[1],
                            endPoint[0] - startPoint[0],
                            endPoint[1] - startPoint[1]
                        );
                        break;
                    case 'circle':
                        this.canvasManager.drawCircle(
                            startPoint[0], startPoint[1],
                            endPoint[0], endPoint[1]
                        );
                        break;
                    case 'triangle':
                        this.canvasManager.drawTriangle(
                            startPoint[0], startPoint[1],
                            endPoint[0], endPoint[1]
                        );
                        break;
                }
                this.canvasManager.ctx.stroke();
            } else {
                // For brush and eraser, draw the stroke normally
                this.canvasManager.ctx.beginPath();
                this.canvasManager.ctx.globalAlpha = stroke.opacity;
                this.canvasManager.ctx.strokeStyle = stroke.color;
                this.canvasManager.ctx.lineWidth = stroke.width;
                this.canvasManager.ctx.moveTo(stroke.points[0][0], stroke.points[0][1]);
                
                for (const point of stroke.points) {
                    if (!this.isReplaying) break;  // Stop if replay was cancelled
                    this.canvasManager.ctx.lineTo(point[0], point[1]);
                    this.canvasManager.ctx.stroke();
                    await new Promise(resolve => setTimeout(resolve, 10));
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.isReplaying = false;
    }

    updateHistoryList() {
        const historyListElement = document.getElementById('historyList');
        const states = this.history.getAllStates();
        
        historyListElement.innerHTML = states.map(state => `
            <div class="history-item ${state.isCurrent ? 'current' : ''}" 
                 onclick="window.drawingApp.jumpToState(${state.id})">
                ${state.isInitial ? 'Initial State' : `State ${state.id}`}
            </div>
        `).join('');
        
        if (states.length > 0) {
            const currentItem = historyListElement.querySelector('.current');
            if (currentItem) {
                currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    updateButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn && redoBtn) {
            undoBtn.disabled = !this.history.current?.prev;
            redoBtn.disabled = !this.history.current?.next;
        }
    }
}
