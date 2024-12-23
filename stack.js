/**
 * Stack Data Structure
 * 
 * Used for: Undo/Redo operations
 * 
 * Properties:
 * - LIFO (Last In, First Out) principle
 * - O(1) time complexity for push and pop operations
 * - Maintains order of operations for undo/redo
 * 
 * Implementation:
 * - Uses a linked list internally
 * - Each node points to the next node
 * - Top of stack is the head of the linked list
 */

/**
 * Node class for Stack
 * Each node contains data and a reference to the next node
 */
class Node {
    constructor(data) {
        this.data = data;    // The actual data stored
        this.next = null;    // Reference to next node
    }
}

export class Stack {
    constructor() {
        this.head = null;    // Top of the stack
        this.size = 0;       // Number of items in stack
    }

    /**
     * Adds an item to the top of the stack
     * Time Complexity: O(1)
     * @param {*} data - Item to add
     */
    push(data) {
        const newNode = new Node(data);
        newNode.next = this.head;  // New node points to current top
        this.head = newNode;       // New node becomes the top
        this.size++;
    }

    /**
     * Removes and returns the top item from the stack
     * Time Complexity: O(1)
     * @returns {*} The top item, or null if stack is empty
     */
    pop() {
        if (!this.head) return null;
        const data = this.head.data;
        this.head = this.head.next;  // Top becomes the next node
        this.size--;
        return data;
    }

    /**
     * Returns the top item without removing it
     * Time Complexity: O(1)
     * @returns {*} The top item, or null if stack is empty
     */
    peek() {
        return this.head ? this.head.data : null;
    }

    /**
     * Checks if stack is empty
     * Time Complexity: O(1)
     * @returns {boolean} True if stack is empty
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * Clears all items from the stack
     * Time Complexity: O(1)
     */
    clear() {
        this.head = null;
        this.size = 0;
    }
}
