import Dot, { DotColors } from "./dot";

const DefaultRefillTimeDelay = 500;
const DefaultMaxDotColors = 5;

export default class DotGrid {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.canRefill = true;

        this.dotSpacingX = this.config.width / (this.config.numColumns + 0.5);
        this.dotSpacingY = this.config.height / this.config.numRows;

        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = [];
        for (let h  = 0; h < this.config.numRows; h++) {
            let row = [];
            
            for (let w = 0; w < this.config.numColumns; w++) {
                let pos = this.calculateWorldPos(h, w);
                row.push({
                    position: pos,
                    dot: null
                });
            }

            this.grid.push(row);
        }
    }

    update() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let dot = this.grid[row][col].dot;
                if (dot)
                    dot.update();
            }
        }
    }

    randomizeDots() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                if (this.grid[row][col].dot) {
                    this.grid[row][col].dot.visible = false;
                    this.grid[row][col].dot.destroy();
                    this.grid[row][col].dot = null;
                }
                let dot = this.createDot();
                this.grid[row][col].dot = dot;
                dot.setGridPos(row, col);
                let worldPos = this.calculateWorldPos(row, col);
                dot.setPosition(worldPos.x, worldPos.y);
            }
        }
    }

    explodeClear(refill = false) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let dot = this.grid[row][col].dot;
                if (dot) {
                    dot.disable(true);
                    dot.destroy();
                }
                this.grid[row][col].dot = null;
            }
        }
        
        if (this.canRefill && refill) {
            if (this.refillTimer) {
                this.refillTimer.remove();
            }
            this.refillTimer = this.scene.time.delayedCall(DefaultRefillTimeDelay, this.refillGrid, null, this);
        }
    }

    createDot() {
        let dot = new Dot(this.scene, 0, 0, this.config.dotScale);
        dot.setColorByIndex(this.getRandomDotColorIdx());

        dot.on('pointerdown', () => {
            this.scene.onDotClicked(dot);
        });

        dot.on('pointerover', () => {
            this.scene.onDotHovered(dot);
        });

        dot.enable();

        return dot;        
    }

    resumeRefill() {
        this.canRefill = true;
        if (this.refillTimer) {
            this.refillTimer.paused = false;
        }
    }
    
    pauseRefill() {
        this.canRefill = false;
        if (this.refillTimer) {
            this.refillTimer.paused = true;
        }
    }

    removeDot(dot) {
        this.grid[dot.row][dot.column].dot = null;
        dot.disable();

        this.moveDotsDownFromCell(dot.row, dot.column);
        
        if (this.canRefill) {
            if (this.refillTimer) {
                this.refillTimer.remove();
            }
            this.refillTimer = this.scene.time.delayedCall(DefaultRefillTimeDelay, this.refillGrid, null, this);
        }
    }

    removeDots(dots) {
        let lowestRowsPerColumn = [];
        for (let col = 0; col < this.config.numColumns; col++)
            lowestRowsPerColumn.push(-1);
        
        dots.forEach(dot => {
            this.grid[dot.row][dot.column].dot = null;
            dot.disable();

            if (lowestRowsPerColumn[dot.column] < dot.row)
                lowestRowsPerColumn[dot.column] = dot.row;
        });

        lowestRowsPerColumn.forEach((row, idx) => {
            if (row == -1)
                return;
            this.moveDotsDownFromCell(row, idx);
        });
        
        if (this.canRefill) {
            if (this.refillTimer) {
                this.refillTimer.remove();
            }
            this.refillTimer = this.scene.time.delayedCall(DefaultRefillTimeDelay, this.refillGrid, null, this);
        }
    }

    removeDotsByColorId(id) {
        let lowestRowsPerColumn = [];
        for (let col = 0; col < this.config.numColumns; col++)
            lowestRowsPerColumn.push(-1);
        
        for (let row = this.grid.length - 1; row >= 0; row--) {
            let lowestRow = -1;
        
            for (let col = 0; col < this.grid[row].length; col++) {
                let dot = this.grid[row][col].dot;
                if (dot && dot.colorData.id === id) {
                    this.grid[row][col].dot = null;
                    dot.disable(true);

                    // if lowest row is not -1 then it has already been set
                    if (lowestRowsPerColumn[col] < row)
                        lowestRowsPerColumn[col] = row;
                }
            }
        }

        lowestRowsPerColumn.forEach((row, idx) => {
            if (row == -1)
                return;
            this.moveDotsDownFromCell(row, idx);
        });

        if (this.canRefill) {
            if (this.refillTimer) {
                this.refillTimer.remove();
            }
            this.refillTimer = this.scene.time.delayedCall(DefaultRefillTimeDelay, this.refillGrid, null, this);
        }
    }

    moveDotsDownFromCell(startRow, startCol) {
        let lastNullRow = startRow;
        for (let row = startRow; row >= 0; row--) {
            let nextDot = this.grid[row][startCol].dot;
            if (!nextDot)
                continue;

            let tweenPath = this.buildTweenPath(startCol, nextDot.row, lastNullRow)
            nextDot.tweenAlongPath(tweenPath);
            nextDot.setGridPos(lastNullRow, startCol);

            this.grid[row][startCol].dot = null;
            this.grid[lastNullRow][startCol].dot = nextDot;

            lastNullRow--;
        }
    }

    refillGrid() {
        for (let row = this.grid.length - 1; row >= 0; row--) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let cell = this.grid[row][col];
                if (cell.dot == null) {
                    let newDot = this.createDot();
                    newDot.setPosition(this.grid[row][col].position.x, this.grid[row][col].position.y);
                    newDot.setGridPos(row, col);
                    cell.dot = newDot;
                }
            }
        }
    }

    isDotAdjacent(from, to) {
        if ((from.row - 1 === to.row || from.row + 1 === to.row) && from.column === to.column)
            return true;

        if ((from.column - 1 === to.column || from.column + 1 === to.column) && from.row === to.row)
            return true;

        if (from.row % 2 == 1) {
            if ((from.row - 1 === to.row || from.row + 1 === to.row) && from.column + 1 === to.column)
                return true;
        } else {
            if ((from.row - 1 === to.row || from.row + 1 === to.row) && from.column - 1 === to.column)
                return true;
        }

        return false;
    }

    getNeighbors(row, col) {
        const neighbors = [];
        const isOddRow = row % 2 == 1;

        const topLeft = { row: row - 1, column: col - (isOddRow ? 0 : 1) };
        const topRight = { row: row - 1, column: col + (isOddRow ? 1 : 0) };
        const left = { row: row, column: col - 1 };
        const right = { row: row, column: col + 1 };
        const bottomLeft = { row: row + 1, column: col - (isOddRow ? 0 : 1) };
        const bottomRight = { row: row + 1, column: col + (isOddRow ? 1 : 0) };

        // top left / right
        if (row > 0) {
            if (col == 0) {
                if (isOddRow) {
                    neighbors.push(topLeft, topRight);
                } else {
                    neighbors.push(topRight);
                }
            } else if (col == this.config.numColumns - 1) {
                if (isOddRow) {
                    neighbors.push(topLeft);
                } else {
                    neighbors.push(topLeft, topRight);
                }
            } else {
                neighbors.push(topLeft, topRight);
            }
        }

        // left / right
        if (col == 0) {
            neighbors.push(right);
        } else if (col == this.config.numColumns - 1) {
            neighbors.push(left);
        } else {
            neighbors.push(left, right);
        }
        
        // bottom left / right
        if (row < this.config.numRows - 1) {
            if (col == 0) {
                if (isOddRow) {
                    neighbors.push(bottomLeft, bottomRight);
                } else {
                    neighbors.push(bottomRight);
                }
            } else if (col == this.config.numColumns - 1) {
                if (isOddRow) {
                    neighbors.push(bottomLeft);
                } else {
                    neighbors.push(bottomLeft, bottomRight);
                }
            } else {
                neighbors.push(bottomLeft, bottomRight);
            }
        }

        return neighbors;
    }

    setColorIdLightened(id, flag) {
        for (let row = this.grid.length - 1; row >= 0; row--) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let cell = this.grid[row][col];
                if (cell.dot && cell.dot.colorData.id == id) {
                    cell.dot.setLightenedTint(flag);
                }
            }
        }
    }

    setColorsFlowered(flag) {
        for (let row = this.grid.length - 1; row >= 0; row--) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let cell = this.grid[row][col];
                cell.dot.setIsFlowered(flag);
            }
        }
    }

    buildTweenPath(column, oldRow, newRow) {
        let pathPoints = [];
        for (let row = oldRow + 1; row <= newRow; row++) {
            pathPoints.push({
                x: this.grid[row][column].position.x,
                y: this.grid[row][column].position.y,
            });
        }

        const path = new Phaser.Curves.Path(this.grid[oldRow][column].position.x, this.grid[oldRow][column].position.y);
        path.splineTo(pathPoints);
        return path;
    }

    getRandomDotColorIdx() {
        const maxDotColors = Math.min(DotColors.length, this.config.numOfDotColors || DefaultMaxDotColors);
        return Math.floor(Math.random() * maxDotColors);
    }

    calculateWorldPos(row, column) {
        const pos = {
            x: ((this.config.x + this.config.width) / 2) - this.config.width / 2 + this.dotSpacingX * (column + 0.5),
            y: ((this.config.y + this.config.height) / 2) - this.config.height / 2 + this.dotSpacingY * (row + 0.5)
        };

        if (row % 2 == 1)
            pos.x += this.dotSpacingX / 2;

        return pos;
    }
}