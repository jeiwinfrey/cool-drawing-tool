# Data Structures in Drawing Tool

This document explains the three main data structures used in our drawing tool and where to find their implementations.

## 1. Stack (Undo/Redo)
**File Location:** `stack.js`

### Purpose
- Used for managing undo/redo operations
- Follows Last-In-First-Out (LIFO) principle
- Perfect for tracking sequential operations that need to be undone

### Implementation
```javascript
class Node {
    constructor(data) {
        this.data = data;    // The data to store
        this.next = null;    // Reference to next node
    }
}

class Stack {
    constructor() {
        this.head = null;    // Top of stack
        this.size = 0;       // Number of items
    }
    
    // Main operations:
    push(data)   // Add to top
    pop()        // Remove from top
    peek()       // View top without removing
}
```

### Key Methods
- `push()`: Add item to top 
- `pop()`: Remove from top 
- `peek()`: View top item 

## 2. Queue (Replay Animation)
**File Location:** `queue.js`

### Purpose
- Used for replay animation
- Follows First-In-First-Out (FIFO) principle
- Maintains order of drawing strokes for replay

### Implementation
```javascript
class Queue {
    constructor() {
        this.items = [];     // Array to store items
    }
    
    // Main operations:
    enqueue(item)  // Add to end
    dequeue()      // Remove from front
    peek()         // View front without removing
}
```

### Key Methods
- `enqueue()`: Add to end 
- `dequeue()`: Remove from front 
- `isEmpty()`: Check if empty 

### Replay Process
1. Strokes are stored in `strokesArray` in `DrawingStateManager`
2. During replay:
   - Original canvas state is saved
   - Canvas is cleared
   - Strokes are queued
   - Each stroke is dequeued and animated
   - Original state is restored after replay

## 3. Doubly Linked List (History)
**File Location:** `history.js`

### Purpose
- Used for managing drawing history
- Allows bidirectional navigation (forward/backward)
- Maintains complete timeline of canvas states

### Implementation
```javascript
class HistoryNode {
    constructor(data, id) {
        this.data = data;    // Canvas state
        this.id = id;        // Unique identifier
        this.next = null;    // Next state
        this.prev = null;    // Previous state
    }
}

class HistoryList {
    constructor() {
        this.head = null;     // First state
        this.tail = null;     // Last state
        this.current = null;  // Current state
    }
    
    // Main operations:
    append(data)   // Add new state
    undo()         // Move to previous
    redo()         // Move to next
}
```

### Key Methods
- `append()`: Add new state 
- `undo()`: Move to previous state
- `redo()`: Move to next state 
- `moveTo()`: Jump to specific state 

## Code Locations

1. **Stack Implementation**
   - File: `stack.js`
   - Used in: DrawingStateManager for undo/redo

2. **Queue Implementation**
   - File: `queue.js`
   - Used in: DrawingStateManager for replay

3. **History Implementation**
   - File: `history.js`
   - Used in: DrawingStateManager for state management

4. **Stroke Storage and Replay**
   - File: `drawingStateManager.js`
   - Methods:
     - `storeStroke()`: Stores stroke data
     - `replayStrokes()`: Handles replay animation

## How They Work Together

1. **Drawing Process:**
   ```
   User Draws → Store Stroke → Save Canvas State → Update History
   ```

2. **Undo/Redo Process:**
   ```
   User Clicks Undo/Redo → Navigate History → Load Canvas State
   ```

3. **Replay Process:**
   ```
   User Clicks Replay → Queue Strokes → Animate Each Stroke → Restore State
   ```
