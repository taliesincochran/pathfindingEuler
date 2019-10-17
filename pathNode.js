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
     * params {interger} m # Height of grid
     * params {interger} n # Length of grid
     * params {string} current # String representing current coordinates in x:y form
     */
    constructor(used, n, m, current) {
        this.n = n;
        this.m = m;
        this.used = new Set(used);
        this.current = current;
        this.used.add(this.current);
        this.depth = used.size;
        let [xRaw,yRaw] = current.split(":");
        console.log(this);        this.x = parseInt(xRaw);
        this.y = parseInt(yRaw);
        this.upCoordinate = this.x + ":" + (this.y - 1);
        this.downCoordinate = this.x + ":" + (this.y + 1);
        this.leftCoordinate = (this.x + 1) + ":" + this.y;
        this.rightCoordinate = (this.x - 1) + ":" + this.y;
        this.validMoves = this.validMoves.bind(this);
        this.validDirections = this.validMoves();
        console.log(this.validDirections);
        this.up = this.validDirections.up ? new PathNode(this.used, this.n, this.m, this.upCoordinate) : null;
        console.log('up:', this.up? true:false);
        this.down = this.validDirections.down ? new PathNode(this.used, this.n, this.m, this.downCoordinate) : null;
        this.right = this.validDirections.right ? new PathNode(this.used, this.n, this.m, this.rightCoordinate) : null;
        this.left = this.validDirections.left ? new PathNode(this.used, this.n, this.m, this.leftCoordinate) : null;
        if(this.used.size === (this.n * this.m) && this.current === ("0:" + this.m)) {
            counter++;
            console.log('bingo');
        } 
    }
    
    // valid move method
    validMoves () {
        // Returned varable.  Any test will determine if the direction remain true
        let validMoves = {
            up: true,
            down:true,
            right:true,
            left:true
        }
        if((this.m * this.n) === this.depth) {
            validMoves = {
                up: false,
                down: false,
                right: false,
                left: false
            }
        }
        if (this.used.has((this.x + 1) + ":" + this.y) || this.x + 1 > this.n) {
            validMoves.right = false;
        }
        if (this.used.has((this.x - 1) + ":" + this.y) || this.x - 1 < 0) {
            validMoves.left = false;
        }
        if (this.used.has(this.x + ":" + (this.y - 1)) || this.y + 1 > this.m) {
            validMoves.up = false;
        }
        if (this.used.has(this.x + ":" + (this.y + 1)) || this.y - 1 < 0) {
            validMoves.down = false;
        }
        
        /* Certain moves lead to invalid paths
        * If we can stop these paths from being populated, we will greatly reduce the number of calculations
        * I: Invalid Move
        * V: Valid move
        * O: Open Square
        * 1-9: Oreder of moves
        * problem 1: bisected empty squares such as 1  2  3  4  5   or 1 2 3 O
        *                                           O  I  O  O  6      O O 4 5
        *                                           O 12  V  O  7
        *                                           O 11 10  9  8
        * 
        * problem two: u shape, three squares such as: 1 O 5
        *                                              2 3 4
        * 
        *    There are eight ways this shape can occure, two for each direction. 
        *    If this shape occurs, there is only one valid direction.
        * 
        * Problem 3: Addjacent to corner.  If the current square is adjacent to an empty corner, it can only move to the corner
        * 
        * Problem 4: Line one square away from the border, if the direction is counter clockwise
        *                                 1 2 3 4
        *                                 O O 6 5
        *                                 O O 7 V
        *                                 O O I O
        */
       return validMoves;
    }
}
let usedNodes = new Set()
usedNodes.add("0:0");
var pathTree = new PathNode(usedNodes, mValue, nValue, "0:0", 1);
console.log(counter);
