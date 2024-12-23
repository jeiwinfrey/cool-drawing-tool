/**
 * History Implementation using Doubly Linked List
 * 
 * Used for: Drawing History Management
 * 
 * Properties:
 * - Bidirectional navigation (can move both forward and backward)
 * - Perfect for undo/redo operations
 * 
 * Implementation:
 * - Each node contains canvas state data
 * - Nodes are connected in both directions (prev/next)
 * - Current node tracks the active state
 */

/**
 * Node class for History
 * Each node represents a canvas state in the history
 */
class HistoryNode {
    constructor(data, id) {
        this.data = data;      // Canvas image data
        this.id = id;          // Unique identifier
        this.next = null;      // Reference to next state
        this.prev = null;      // Reference to previous state
    }
}

export class HistoryList {
    constructor() {
        this.head = null;      // First state in history
        this.tail = null;      // Last state in history
        this.current = null;   // Current active state
        this.size = 0;         // Number of states
        this.nextId = 1;       // Counter for generating IDs
    }

    /**
     * Adds a new state to the history
     * If adding after an undo, truncates future states
     * @param {ImageData} data - Canvas state to save
     * @returns {HistoryNode} Newly created node
     */
    append(data) {
        const newNode = new HistoryNode(data, this.nextId++);
        
        // If we're not at the end, truncate future states
        if (this.current && this.current !== this.tail) {
            this.tail = this.current;
            this.current.next = null;
        }

        if (!this.head) {
            // First state in history
            this.head = newNode;
            this.tail = newNode;
            this.current = newNode;
        } else {
            // Add to end of history
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
            this.current = newNode;
        }
        this.size++;
        return newNode;
    }

    /**
     * Moves to a specific state by ID
     * @param {number} id - ID of target state
     * @returns {HistoryNode|null} Target state if found
     */
    moveTo(id) {
        let node = this.head;
        while (node) {
            if (node.id === id) {
                this.current = node;
                return node;
            }
            node = node.next;
        }
        return null;
    }

    /**
     * Moves to previous state (undo)
     * @returns {HistoryNode|null} Previous state
     */
    undo() {
        if (!this.current || !this.current.prev) return null;
        this.current = this.current.prev;
        return this.current;
    }

    /**
     * Moves to next state (redo)
     * @returns {HistoryNode|null} Next state
     */
    redo() {
        if (!this.current || !this.current.next) return null;
        this.current = this.current.next;
        return this.current;
    }

    /**
     * Clears the history
     */
    clear() {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.size = 0;
        this.nextId = 1;
    }

    /**
     * Gets current state
     * @returns {HistoryNode|null} Current state
     */
    getCurrentState() {
        return this.current;
    }

    /**
     * Gets all states with metadata
     * @returns {Array} Array of state objects
     */
    getAllStates() {
        const states = [];
        let node = this.head;
        while (node) {
            states.push({
                id: node.id,
                data: node.data,
                isCurrent: node === this.current,
                isInitial: node === this.head && this.size === 1
            });
            node = node.next;
        }
        return states;
    }
}
