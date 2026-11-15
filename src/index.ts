const MAX_GRID_CELLS = 1_000_000;

export interface Point {
  x: number;
  y: number;
}

export class GridBoard {
  private readonly _width: number;
  private readonly _height: number;
  private readonly grid: Uint8Array;

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
    this.grid = new Uint8Array(width * height);
  }

  public setObstacle(x: number, y: number): void {
    if (this.isValid(x, y)) {
      this.grid[y * this.width + x] = 1;
    }
  }

  /** Remove an existing wall to let editors revise their maps. Invalid cells are ignored. */
  public clearObstacle(x: number, y: number): void {
    if (this.isValid(x, y)) {
      this.grid[y * this.width + x] = 0;
    }
  }

  public isObstacle(x: number, y: number): boolean {
    return this.isValid(x, y) && this.grid[y * this.width + x] === 1;
  }

  public isValid(x: number, y: number): boolean {
    return Number.isSafeInteger(x) && Number.isSafeInteger(y)
      && x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Count all walkable cells connected to a start position.
   * Uses an iterative breadth-first search to avoid recursion limits on large grids.
   */
  public reachableArea(start: Point): number {
    if (!this.isValid(start.x, start.y) || this.isObstacle(start.x, start.y)) return 0;
    const queue: Point[] = [{ x: start.x, y: start.y }];
    const seen = new Set<number>([start.y * this.width + start.x]);
    const directions: Point[] = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
    ];
    for (let index = 0; index < queue.length; index += 1) {
      const point = queue[index];
      for (const move of directions) {
        const nextX = point.x + move.x;
        const nextY = point.y + move.y;
        if (!this.isValid(nextX, nextY) || this.isObstacle(nextX, nextY)) continue;
        const key = nextY * this.width + nextX;
        if (!seen.has(key)) {
          seen.add(key);
          queue.push({ x: nextX, y: nextY });
        }
      }
    }
    return seen.size;
  }

  /** Returns the shortest four-directional path, or null when no route exists. */
  public findPath(start: Point, goal: Point): Point[] | null {
    if (!this.isValid(start.x, start.y) || !this.isValid(goal.x, goal.y)
      || this.isObstacle(start.x, start.y) || this.isObstacle(goal.x, goal.y)) {
      return null;
    }

    const startIndex = start.y * this.width + start.x;
    const goalIndex = goal.y * this.width + goal.x;
    if (startIndex === goalIndex) return [{ x: start.x, y: start.y }];

    const previous = new Int32Array(this.grid.length).fill(-1);
    const queue = new Int32Array(this.grid.length);
    previous[startIndex] = startIndex;
    queue[0] = startIndex;
    let size = 1;
    const directions: Point[] = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
    ];

    for (let index = 0; index < size; index += 1) {
      const current = queue[index];
      if (current === goalIndex) break;
      const x = current % this.width;
      const y = Math.floor(current / this.width);

      for (const direction of directions) {
        const nextX = x + direction.x;
        const nextY = y + direction.y;
        if (!this.isValid(nextX, nextY)) continue;

        const next = nextY * this.width + nextX;
        if (this.grid[next] === 0 && previous[next] === -1) {
          previous[next] = current;
          queue[size] = next;
          size += 1;
        }
      }
    }

    if (previous[goalIndex] === -1) return null;

    const path: Point[] = [];
    for (let cursor = goalIndex; ; cursor = previous[cursor]) {
      path.push({ x: cursor % this.width, y: Math.floor(cursor / this.width) });
      if (cursor === startIndex) break;
    }
    return path.reverse();
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
