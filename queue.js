/**
 * Queue Data Structure
 * 
 * Used for: Replay Animation
 * 
 * Properties:
 * - FIFO (First In, First Out) principle
 * - O(1) time complexity for enqueue and dequeue operations
 * - Perfect for sequential processing of drawing strokes
 * 
 * Implementation:
 * - Uses an array internally for simplicity
 * - Array shift/unshift operations are used for queue operations
 * - Maintains order of drawing strokes for replay
 */
export class Queue {
    constructor() {
        this.items = [];     // Array to store queue items
    }

    /**
     * Adds an item to the end of the queue
     * Used to add drawing strokes for replay
     * @param {*} item - Item to add (usually a stroke object)
     */
    enqueue(item) {
        this.items.push(item);
    }

    /**
     * Removes and returns the first item from the queue
     * Used to process strokes in order during replay
     * @returns {*} The first item, or null if queue is empty
     */
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    /**
     * Checks if queue is empty
     * @returns {boolean} True if queue is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Clears all items from the queue
     * Used to reset replay state
     */
    clear() {
        this.items = [];
    }

    /**
     * Returns the first item without removing it
     * @returns {*} The first item, or null if queue is empty
     */
    peek() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    /**
     * Returns the current number of items in the queue
     * @returns {number} Number of items in queue
     */
    size() {
        return this.items.length;
    }
}
