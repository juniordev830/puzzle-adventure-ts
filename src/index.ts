const MAX_GRID_CELLS = 1_000_000;

export interface Point {
  x: number;
  y: number;
}

export class GridBoard {
  private readonly _width: number;
  private readonly _height: number;
  private grid: number[][];

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  constructor(width: number, height: number) {
    if (!Number.isSafeInteger(width) || width <= 0) {
      throw new RangeError('Grid width must be a positive safe integer.');
    }
    if (!Number.isSafeInteger(height) || height <= 0) {
      throw new RangeError('Grid height must be a positive safe integer.');
    }
    if (width > Math.floor(MAX_GRID_CELLS / height)) {
      throw new RangeError(`Grid dimensions cannot exceed ${MAX_GRID_CELLS.toLocaleString()} total cells.`);
    }
    this._width = width;
    this._height = height;
    this.grid = Array.from({ length: height }, () => Array(width).fill(0));
  }

  public setObstacle(x: number, y: number): void {
    if (this.isValid(x, y)) {
      this.grid[y][x] = 1;
    }
  }

  /** Removes a wall so the same board can be edited between puzzle attempts. */
  public clearObstacle(x: number, y: number): void {
    if (!this.isValid(x, y)) {
      throw new RangeError('Obstacle position must be inside the board.');
    }
    this.grid[y][x] = 0;
  }

  /**
   * Renders a compact text map and overlays the shortest route, if reachable.
   * S = start, G = goal, B = both, # = wall, * = route, . = free.
   * Restricted to 10,000 cells to avoid accidentally dumping enormous maps.
   */
  public renderAscii(start: Point, goal: Point): string {
    if (this.width * this.height > 10_000) {
      throw new RangeError('ASCII map must have at most 10,000 cells.');
    }
    if (!start || !goal || !this.isValid(start.x, start.y) ||
        !this.isValid(goal.x, goal.y) ||
        this.isObstacle(start.x, start.y) || this.isObstacle(goal.x, goal.y)) {
      throw new RangeError('Start and goal must be valid unblocked cells.');
    }

    const route = this.findPath(start, goal);
    const marks = new Set((route ?? []).map(point => `${point.x},${point.y}`));
    const lines: string[] = [];
    for (let y = 0; y < this.height; y += 1) {
      let row = '';
      for (let x = 0; x < this.width; x += 1) {
        const isStart = x === start.x && y === start.y;
        const isGoal = x === goal.x && y === goal.y;
        if (isStart && isGoal) row += 'B';
        else if (isStart) row += 'S';
        else if (isGoal) row += 'G';
        else if (this.isObstacle(x, y)) row += '#';
        else if (marks.has(`${x},${y}`)) row += '*';
        else row += '.';
      }
      lines.push(row);
    }
    return lines.join('\n');
  }

  public isObstacle(x: number, y: number): boolean {
    return this.isValid(x, y) && this.grid[y][x] === 1;
  }

  public isValid(x: number, y: number): boolean {
    return Number.isSafeInteger(x) && Number.isSafeInteger(y)
      && x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /** Returns the shortest four-directional path, or null when no route exists. */
  public findPath(start: Point, goal: Point): Point[] | null {
    if (!this.isValid(start.x, start.y) || !this.isValid(goal.x, goal.y)
      || this.isObstacle(start.x, start.y) || this.isObstacle(goal.x, goal.y)) {
      return null;
    }

    const key = (point: Point): string => `${point.x},${point.y}`;
    const queue: Point[] = [{ x: start.x, y: start.y }];
    const previous = new Map<string, Point | null>([[key(queue[0]), null]]);
    const directions: Point[] = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
    ];

    for (let index = 0; index < queue.length; index += 1) {
      const current = queue[index];
      if (current.x === goal.x && current.y === goal.y) break;
      for (const direction of directions) {
        const next = { x: current.x + direction.x, y: current.y + direction.y };
        const nextKey = key(next);
        if (this.isValid(next.x, next.y) && !this.isObstacle(next.x, next.y)
          && !previous.has(nextKey)) {
          previous.set(nextKey, current);
          queue.push(next);
        }
      }
    }

    const goalKey = key(goal);
    if (!previous.has(goalKey)) return null;
    const path: Point[] = [];
    let cursor: Point | null = { x: goal.x, y: goal.y };
    while (cursor !== null) {
      path.push(cursor);
      cursor = previous.get(key(cursor)) ?? null;
    }
    return path.reverse();
  }
}

export function main(): void {
  const board = new GridBoard(5, 5);
  board.setObstacle(2, 2);
  console.log('🧩 Puzzle Board setup complete. Obstacle at (2,2):', board.isObstacle(2, 2));
  console.log(board.renderAscii({ x: 0, y: 0 }, { x: 4, y: 4 }));
}

if (require.main === module) {
  main();
}
