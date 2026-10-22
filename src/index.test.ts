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
