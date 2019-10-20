#!/usr/bin/env node
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
    constructor(used, path, maxX, maxY, current, previousDirection) {
        this.data = {
            maxX : maxX,
            maxY : maxY,
            current: current,
            used: new Set(used),
            x: parseInt(current.split(":")[0]),
            y: parseInt(current.split(":")[1]),
            previousDirection: previousDirection,
            // Create a copy of the parents used set.
            // Depth can be calculated by counting the set and adding one
            // for debugging remove later
            path: path += ('--> ' + (used.sizze === 0? '' : previousDirection) + ' ' + current),
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
        // console.log(this.data);
        
        // if(this.data.depth === (this.data.maxX * this.data.maxY) && this.data.current === ("0:" + this.data.maxY)) {
        // counter++;
            // console.log("bingo");
        // } else {
            this.validMoves(this.data);
        // }
    }
    checkInBounds (x, y, maxX, maxY) {
        if(x < 1 || x > maxX) {
            return false
        } else if(y < 1 || y > maxY) {
            return false;
        } else {
            return true;
        }
    }
    checkNotUsed(x, y, used) {
        let coordinate = x + ":" + y;
        if(used && used.has(coordinate)) {
            return false;
        } else {
            return true;
        }
    }
    // valid move method
    validMoves (data) {
        let {x, y, used, path, maxX, maxY, previousDirection, upCoordinate, downCoordinate, leftCoordinate, rightCoordinate} = data;
        let up = (this.checkInBounds(x, y - 1, maxX, maxY) && this.checkNotUsed(x, y - 1, used) && previousDirection !== "down");
        let down = (this.checkInBounds(x, y + 1, maxX, maxY) && this.checkNotUsed(x, y + 1, used) && previousDirection !== "up");
        let right = (this.checkInBounds(x + 1, y, maxX, maxY) && this.checkNotUsed(x + 1, y, used) && previousDirection !== "left");
        let left = (this.checkInBounds(x - 1, y, maxX, maxY) && this.checkNotUsed(x - 1, used) && previousDirection !== "right");
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
                        ["down", "left", "up"]

        function checkDirection (direction, factor, that) {
            let dx = direction === "right" ? 1 
                : direction === "left"? -1
                    : 0;
            let dy = direction === "down"? 1
                : direction === "up"? -1
                    : 0;
            return (that.checkInBounds(x + (factor * dx), y + (factor * dy), maxX, maxY) && that.checkNotUsed(x + (factor * dx), y + (factor * dy), used))  
        }

        // function checkVoid (direction, that) {
        //     // This function is to check if we have created a void. If we have, then we should abort this path
        //     let dx = direction === "right" || direction === "down" ? 1
        //         : direction === "left" || direction === "up"? -1
        //             : 0;
        //     let dy = direction === "down" || direction === "right"? 1
        //         : direction === "up" || direction === "left"? -1
        //             : 0;
        //     return (that.checkInBounds(x + dx, y + dy, maxX, maxY) && that.checkNotUsed(x + dx, y + dy, used))
        // }
        let validDirections = new Set();
        // Go through potential directions to chec for problems
        for(let i = 0; i < 3; i++) {
            // console.log('this.data.current ', this.data.current)
            if(this.data.current === ("1:" + this.data.maxY) && this.data.used.size ===(this.data.maxX * this.data.maxY)){
                counter++;
                // console.log('+++++++++++++++++++++++++++++++++++++++++');
                // console.log('------------------Goal-------------------');
                // console.log('+++++++++++++++++++++++++++++++++++++++++');
                // console.log('this.data.path', this.data.path);
                break;
            }
            // check to see if that directions adjacent square is empty and in bounds
            
            let emptyAdjacentSquare = checkDirection(directionOrder[i], 1, this);
            if (emptyAdjacentSquare) {
                // if the square is empty, check the one past it
                // let unusableSquareAcrossFromEmpty = !checkDirection(directionOrder[i], 2, this);
                // if (unusableSquareAcrossFromEmpty && !validDirections.size) {
                //     console.log(directionOrder[i], ' second square unavailable ', this.data.x, ':', this.data.y)
                    // if the square two steps away is not empty and a direction has not been added to the set of validDirections 
                    // the next step must be toward this direction only. 
                    // We need to see if we are creating a void before proceeding down this path
                    // if(!checkVoid(directionOrder[i])) {
                        // If we are not creating a void, add the direction to the set and break
                        validDirections.add(directionOrder[i]);
                    // } 
                    // No more directions will be considered
                    // break;
                // } else if(!unusableSquareAcrossFromEmpty) {
                    // If there is not an unusable square two blocks away, add the direction and check the next
                    // validDirections.add(directionOrder[i]);
                // } 
                // else {
                //     // Otherwise there is an unuasable square two blocks away,
                //     // unless it is the final square, we should break
                //     if(this.data.depth === ((this.data.maxX * this.data.maxY) - 1) ) {
                //         validDirections.add(directionOrder[i]);
                //     } 
                //     break;
                // }
                // console.log('path:' , this.data.path )
            }
        }
        if(validDirections.size === 0) {
            // console.log('=========================================');
            // console.log('--------------Dead End-------------------');
            // console.log('=========================================');
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
            this.children[direction] = new PathNode(used, path, maxX, maxY, getCoordinates(direction), direction);
        });
    }
}
let usedNodes = new Set()
let path = new PathNode(usedNodes, "start -> ", 8,4,"1:1","right");
console.log(counter);

