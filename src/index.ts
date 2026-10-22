export interface Point {
  x: number;
  y: number;
}

export class GridBoard {
  public width: number;
  public height: number;
  private grid: number[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
  }

  public setObstacle(x: number, y: number): void {
    if (this.isValid(x, y)) {
      this.grid[y][x] = 1;
    }
  }

  public isObstacle(x: number, y: number): boolean {
    return this.isValid(x, y) && this.grid[y][x] === 1;
  }

  public isValid(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
}

export function main(): void {
  const board = new GridBoard(5, 5);
  board.setObstacle(2, 2);
  console.log('🧩 Puzzle Board setup complete. Obstacle at (2,2):', board.isObstacle(2, 2));
}

if (require.main === module) {
  main();
}
