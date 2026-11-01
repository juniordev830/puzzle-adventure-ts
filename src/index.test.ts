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
