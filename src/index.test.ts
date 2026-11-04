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

describe('GridBoard ASCII map and obstacle editing', () => {
  test('shows a deterministic shortest path without changing obstacles', () => {
    const board = new GridBoard(3, 3);
    board.setObstacle(1, 1);

    expect(board.renderAscii({ x: 0, y: 0 }, { x: 2, y: 2 }))
      .toBe('S**\n.#*\n..G');
    expect(board.isObstacle(1, 1)).toBe(true);
    expect(board.findPath({ x: 0, y: 0 }, { x: 2, y: 2 })).toHaveLength(5);
  });

  test('shows start and goal even when no route exists', () => {
    const board = new GridBoard(3, 3);
    for (let y = 0; y < 3; y += 1) board.setObstacle(1, y);
    expect(board.renderAscii({ x: 0, y: 1 }, { x: 2, y: 1 }))
      .toBe('.#.\nS#G\n.#.');
  });

  test('clears obstacles to reopen paths and preserves the same-cell case', () => {
    const board = new GridBoard(3, 1);
    board.setObstacle(1, 0);
    expect(board.findPath({ x: 0, y: 0 }, { x: 2, y: 0 })).toBeNull();
    board.clearObstacle(1, 0);
    expect(board.renderAscii({ x: 0, y: 0 }, { x: 2, y: 0 }))
      .toBe('S*G');
    expect(board.renderAscii({ x: 0, y: 0 }, { x: 0, y: 0 }))
      .toBe('B..');
  });

  test('rejects blocked, invalid or excessively large text maps', () => {
    const board = new GridBoard(3, 3);
    board.setObstacle(0, 0);
    expect(() => board.renderAscii({ x: 0, y: 0 }, { x: 2, y: 2 }))
      .toThrow(RangeError);
    expect(() => board.renderAscii({ x: -1, y: 0 }, { x: 2, y: 2 }))
      .toThrow(RangeError);
    expect(() => board.clearObstacle(4, 4)).toThrow(RangeError);
    const large = new GridBoard(101, 100);
    expect(() => large.renderAscii({ x: 0, y: 0 }, { x: 100, y: 99 }))
      .toThrow(RangeError);
  });
});
