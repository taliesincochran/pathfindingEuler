#!/usr/bin/env node
let mValue = 2;
let nValue = 3;
/* Project Euler: Problem 237
 * on an n x m grid, 
 * calculate the number of paths that pass through all the blocks
 * starting at (0,0) and ending at (0, m)
 * 4 <= m <=8
 * 1<= n <= 5 *10^18
 */
// This varible will increse by one everytime the (0,m square is hit with a depth of n*m.
var counter = 0;

class PathNode {
    /* @constructor
     * params {string{}} used # Set of all squares allready passed through
     * params {interger} y # Height of grid
     * params {interger} x # Length of grid
     * params {string} current # String representing current coordinates in x:y form
     */
    constructor(used, maxX, maxY, current, previousDirection) {
        this.data = {
            maxX : maxX,
            maxY : maxY,
            current: current,
            x: parseInt(current.split(":")[0]),
            y: parseInt(current.split(":")[1]),
            previousDirection: previousDirection,
            // Create a copy of the parents used set.
            // Depth can be calculated by counting the set and adding one
            used: new Set(used),
            depth: used.size + 1,
            upCoordinate: null,
            downCoordinate: null,
            leftCoordinate: null,
            rightCoordinate: null
        }
        // Add the current square to the set.
        this.data.used.add(this.data.current);
        this.children = {
            up: null,
            down: null,
            left: null,
            right: null
        }
        // bind this to class methods
        this.validMoves = this.validMoves.bind(this);
        this.checkInBounds = this.checkInBounds.bind(this);
        this.checkNotUsed = this.checkNotUsed.bind(this);
        this.data = this.validMoves(this.data);
        
        if(this.data.depth === (this.data.maxX * this.data.maxY) && this.data.current === ("0:" + this.data.maxY)) {
            counter++;
            console.log("bingo");
        } else {
            this.checkValidMoves(this.data);
        }
    }
    checkInBounds (x, y, maxX, maxY) {
        if(x < 0 || x > maxX) {
            return false
        } else if(y < 0 || y > maxY) {
            return false;
        } else {
            return true;
        }
    }
    checkNotUsed(x, y, used) {
        let coordinate = x + ":" + y;
        if(used.has(coordinate)) {
            return false;
        } else {
            return true;
        }
    }
    // valid move method
    validMoves (data) {
        let {x, y, used, maxX, maxY, used, previousDirection, upCoordinate, downCoordinate, leftCoordinate, rightCoordinate} = data;
        let up = (checkInBounds(x, y - 1, maxX, maxY) && this.checkNotUsed(x, y - 1, used) && previousDirection !== "down");
        let down = (checkInBounds(x, y + 1, maxX, maxY) && this.checkNotUsed(x, y + 1, used) && previousDirection !== "up");
        let right = (checkInBounds(x + 1, y, maxX, maxY) && this.checkNotUsed(x + 1, y, used) && previousDirection !== "left");
        let left = (checkInBounds(x - 1, y, maxX, maxY) && this.checkNotUsed(x - 1, used) && previousDirection !== "right");
        /* Certain moves lead to invalid paths
         * Priorty goes in clockwise motion from the direction of the previous square
        */
        let directionOrder = previousDirection === "up"
            ?
                ["left", "up", "right"]
                : 
                previousDirection === "right"
                ?
                    ["up", "right", "down"]
                    :
                    previousDirection === "down"
                    ?
                        ["right", "down", "left"]
                        :    
                        ["down", "left", "right"]

        function checkDirection (direction, factor) {
            let dx = direction === "right" ? 1 
                : direction === "left"? -1
                    : 0;
            let dy = direction === "down"? 1
                : direction === "up"? -1
                    : 0;
            return (this.checkInBounds(x + (factor * dx), y + (factor * dy), maxX, maxY) && this.checkNotUsed(x + (factor * dx), y + (factor * dy), used))  
        }

        function checkVoid (direction) {
            // This function is to check if we have created a void. If we have, then we should abort this path
            let dx = direction === "right" || direction === "down" ? 1
                : direction === "left" || direction === "up"? -1
                    : 0;
            let dy = direction === "down" || direction === "right"? 1
                : direction === "up" || direction === "left"? -1
                    : 0;
            return (this.checkInBounds(x + dx, y + dy, maxX, maxY) && this.checkNotUsed(x + dx, y + dy, used))
        }
        let validDirections = new Set();
        // Go through potential directions to chec for problems
        for(let i = 0; i < 3; i++) {
            // check to see if that directions adjacent square is empty and in bounds
            let emptyAdjacentSquare = checkDirection(directionOrder[i], 1);
            if (emptyAdjacentSquare) {
                // if the square is empty, check the one past it
                let unusableSquareAcrossFromEmpty = !checkDirection(directionOrder[i], 2);
                if (unusableSquareAcrossFromEmpty && !validDirection.size) {
                    // if the square two steps away is not empty and a direction has not been added to the set of validDirections 
                    // the next step must be toward this direction only. 
                    // We need to see if we are creating a void before proceeding down this path
                    if(!checkVoid(directionOrder[i])) {
                        // If we are not creating a void, add the direction to the set and break
                        validDirections.add(directionOrder[i]);
                    } 
                    // No more directions will be considered
                    break;
                } else if(!unusableSquareAcrossFromEmpty) {
                    // If there is not an unusable square two blocks away, add the direction and check the next
                    validDirections.add(directionOrder[i]);
                } else {
                    // Otherwise there is an unuasable square two blocks away,
                    // unless it is the final square, we should break
                    if(data.depth === (data.maxX * data.maxY) - 1 ) {
                        validDirections.add(directionOrder[i]);
                    } 
                    break;
                }
            }
        }
        function getCoordinates (direction) {
            let dx = direction === "right" ? 1
                : direction === "left" ? -1
                    : 0;
            let dy = direction === "down" ? 1
                : direction === "up" ? -1
                    : 0;
            return (x + dx) + ":" + (y + dy);
        } 
        validDirections.forEach(direction => {
            this.children[direction] = new PathNode(used, maxX, maxY, getCoordinates(direction), direction);
            console.log(this.data.used);
        });
    }
}
let usedNodes = new Set()

console.log(counter);
