import { useRef, useEffect } from "react";
const Maze = ({ 
    width = window.screen.width,
    height = window.screen.height,
    cellSize = 10,
    backgroundColor = "black",
    strokeColor = "white",
    strokeWeight = 2,
    speed = 1
}) => {
    const canvasRef = useRef(null);
    const animationFrameIdRef = useRef(null); 
    const restartTimeoutRef = useRef(null); 

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const cols = Math.floor(width / cellSize);
        const rows = Math.floor(height / cellSize);
        const grid = Array(cols)
            .fill(null)
            .map(() => Array(rows).fill(false));
        const stack = [];
        let currentCell = { x: 0, y: 0 };

        const drawLine = (from, to) => {
            context.beginPath();
            context.moveTo(from.x * cellSize + cellSize / 2, from.y * cellSize + cellSize / 2);
            context.lineTo(to.x * cellSize + cellSize / 2, to.y * cellSize + cellSize / 2);
            context.strokeStyle = strokeColor;
            context.lineWidth = strokeWeight;
            context.stroke();
            grid[to.x][to.y] = true;
        };

        const getUnvisitedNeighbor = ({ x, y }) => {
            const neighbors = [];
            if (x > 0 && !grid[x - 1][y]) neighbors.push({ x: x - 1, y });
            if (y > 0 && !grid[x][y - 1]) neighbors.push({ x, y: y - 1 });
            if (x < cols - 1 && !grid[x + 1][y]) neighbors.push({ x: x + 1, y });
            if (y < rows - 1 && !grid[x][y + 1]) neighbors.push({ x, y: y + 1 });
            return neighbors.length > 0
                ? neighbors[Math.floor(Math.random() * neighbors.length)]
                : null;
        };

        const animateMaze = () => {
            for (let i = 0; i < speed; i++) {
                const nextCell = getUnvisitedNeighbor(currentCell);
                if (nextCell) {
                    drawLine(currentCell, nextCell);
                    stack.push(currentCell);
                    currentCell = nextCell;
                } else if (stack.length > 0) {
                    currentCell = stack.pop();
                } else {
                    break;
                }
            }

            if (stack.length > 0 || getUnvisitedNeighbor(currentCell)) {
                animationFrameIdRef.current = window.requestAnimationFrame(animateMaze);
            } else {
                restartTimeoutRef.current = setTimeout(() => {
                    initializeCanvas();
                }, 1000);
            }
        };

        const initializeCanvas = () => {
            context.clearRect(0, 0, width, height);
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, width, height);
            for (let col = 0; col < cols; col++) {
                for (let row = 0; row < rows; row++) {
                    grid[col][row] = false;
                }
            }
            currentCell = { x: 0, y: 0 };
            stack.length = 0;

            grid[currentCell.x][currentCell.y] = true;
            animateMaze();
        };

        initializeCanvas();

        return () => {
            if (animationFrameIdRef.current) {
                window.cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (restartTimeoutRef.current) {
                clearTimeout(restartTimeoutRef.current);
            }
        };
    }, [width, height, cellSize, strokeColor, strokeWeight, speed, backgroundColor]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ display: "block", margin: "0 auto", width: width + "px" }}
        />
    );
};



export default Maze;
