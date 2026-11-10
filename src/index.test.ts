import { GridBoard } from './index';

describe('Puzzle Grid Board Tests', () => {
  test('should create valid grid and register obstacles', () => {
    const board = new GridBoard(10, 10);
    expect(board.isValid(5, 5)).toBe(true);
    expect(board.isObstacle(2, 3)).toBe(false);

    board.setObstacle(2, 3);
    expect(board.isObstacle(2, 3)).toBe(true);
  });
});


describe('GridBoard input validation', () => {
  test.each([[0, 5], [5, 0], [-1, 5], [5, -1], [1.5, 5], [5, 2.5]])(
    'rejects invalid dimensions %s x %s',
    (width, height) => {
      expect(() => new GridBoard(width, height)).toThrow(RangeError);
    },
  );

  test('rejects fractional coordinates instead of creating non-cell array properties', () => {
    const board = new GridBoard(3, 3);
    expect(board.isValid(1.5, 1)).toBe(false);
    board.setObstacle(1.5, 1);
    expect(board.isObstacle(1.5, 1)).toBe(false);
  });
});

  test('rejects grids whose total cell count exceeds the allocation limit', () => {
    expect(() => new GridBoard(1_000_001, 1)).toThrow(RangeError);
    expect(() => new GridBoard(1000, 1001)).toThrow(RangeError);
  });


describe('GridBoard pathfinding', () => {
  test('finds a shortest path without crossing obstacles', () => {
    const board = new GridBoard(3, 3);
    board.setObstacle(1, 1);
    const path = board.findPath({ x: 0, y: 0 }, { x: 2, y: 2 });

    expect(path).not.toBeNull();
    expect(path).toHaveLength(5);
    expect(path?.some(point => point.x === 1 && point.y === 1)).toBe(false);
  });

  test('returns null when start or goal is blocked', () => {
    const board = new GridBoard(2, 2);
    board.setObstacle(0, 0);
    expect(board.findPath({ x: 0, y: 0 }, { x: 1, y: 1 })).toBeNull();
  });
});

describe('GridBoard dimension immutability', () => {
  test('does not allow callers to mutate dimensions after allocation', () => {
    const board = new GridBoard(3, 2);

    expect(() => {
      (board as any).width = 100;
    }).toThrow(TypeError);
    expect(() => {
      (board as any).height = 100;
    }).toThrow(TypeError);

    expect(board.width).toBe(3);
    expect(board.height).toBe(2);
    expect(board.isValid(2, 1)).toBe(true);
    expect(board.isValid(3, 1)).toBe(false);
  });
});

describe('Editable maps and reachability', () => {
  test('recomputes connected area after removing a wall', () => {
    const board = new GridBoard(3, 3);
    board.setObstacle(1, 0);
    board.setObstacle(1, 1);
    board.setObstacle(1, 2);
    expect(board.reachableArea({ x: 0, y: 0 })).toBe(3);
    expect(board.findPath({ x: 0, y: 0 }, { x: 2, y: 0 })).toBeNull();
    board.clearObstacle(1, 1);
    expect(board.reachableArea({ x: 0, y: 0 })).toBe(7);
    expect(board.findPath({ x: 0, y: 0 }, { x: 2, y: 0 })).not.toBeNull();
  });

  test('returns zero for blocked or invalid start', () => {
    const board = new GridBoard(2, 2);
    board.setObstacle(0, 0);
    expect(board.reachableArea({ x: 0, y: 0 })).toBe(0);
    expect(board.reachableArea({ x: -1, y: 0 })).toBe(0);
    expect(board.reachableArea({ x: 0.5, y: 0 })).toBe(0);
    board.clearObstacle(-1, 0);
    expect(board.isObstacle(0, 0)).toBe(true);
  });

  test('handles long corridors without recursive stack overflow', () => {
    const board = new GridBoard(1, 5000);
    expect(board.reachableArea({ x: 0, y: 0 })).toBe(5000);
  });
});
