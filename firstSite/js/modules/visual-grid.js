export const initVisualGrid = () => {
  const snakeContainer = document.getElementById("snakes-container");

  if (!snakeContainer) return;

  const gridSize = 80;
  const numRows = 25;
  const numCols = 40;
  const totalHorizontalSnakes = 70;
  const totalVerticalSnakes = 90;

  // Horizontal Snakes
  for (let i = 0; i < totalHorizontalSnakes; i++) {
    const randomRow = Math.floor(Math.random() * numRows);
    const topPos = randomRow * gridSize;
    const snake = document.createElement("div");
    
    const duration = 12 + Math.random() * 12;
    const delay = -(Math.random() * 20);
    const isRev = Math.random() > 0.5;
    const cellsLength = 2 + Math.floor(Math.random() * 3);
    
    snake.className = `snake h-snake ${isRev ? "rev" : ""}`;
    snake.style.top = `${topPos}px`;
    snake.style.width = `${cellsLength * gridSize}px`;
    snake.style.animationDuration = `${duration}s`;
    snake.style.animationDelay = `${delay}s`;
    
    if (isRev) snake.style.animationDirection = "reverse";
    snakeContainer.appendChild(snake);
  }

  // Vertical Snakes
  for (let j = 0; j < totalVerticalSnakes; j++) {
    const randomCol = Math.floor(Math.random() * numCols);
    const leftPos = randomCol * gridSize;
    const snake = document.createElement("div");
    
    const duration = 14 + Math.random() * 12;
    const delay = -(Math.random() * 20);
    const isRev = Math.random() > 0.5;
    const cellsLength = 2 + Math.floor(Math.random() * 4);
    
    snake.className = `snake v-snake ${isRev ? "rev" : ""}`;
    snake.style.left = `${leftPos}px`;
    snake.style.height = `${cellsLength * gridSize}px`;
    snake.style.animationDuration = `${duration}s`;
    snake.style.animationDelay = `${delay}s`;
    
    if (isRev) snake.style.animationDirection = "reverse";
    snakeContainer.appendChild(snake);
  }
};
