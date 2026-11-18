import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { GridBoard } from './index';

describe('Puzzle Grid Board Tests', () => {
  test('should create valid grid and register obstacles', () => {
    const board = new GridBoard(10, 10);
    assert.equal(board.isValid(5, 5), true);
    assert.equal(board.isObstacle(2, 3), false);

    board.setObstacle(2, 3);
    assert.equal(board.isObstacle(2, 3), true);
  });
});


describe('GridBoard input validation', () => {
  for (const [width, height] of [[0, 5], [5, 0], [-1, 5], [5, -1], [1.5, 5], [5, 2.5]]) {
    test(`rejects invalid dimensions ${width} x ${height}`, () => {
      assert.throws(() => new GridBoard(width, height), RangeError);
    });
  }

  test('rejects fractional coordinates instead of creating non-cell array properties', () => {
    const board = new GridBoard(3, 3);
    assert.equal(board.isValid(1.5, 1), false);
    board.setObstacle(1.5, 1);
    assert.equal(board.isObstacle(1.5, 1), false);
  });
});

  test('rejects grids whose total cell count exceeds the allocation limit', () => {
    assert.throws(() => new GridBoard(1_000_001, 1), RangeError);
    assert.throws(() => new GridBoard(1000, 1001), RangeError);
  });


describe('GridBoard pathfinding', () => {
  test('finds a shortest path without crossing obstacles', () => {
    const board = new GridBoard(3, 3);
    board.setObstacle(1, 1);
    const path = board.findPath({ x: 0, y: 0 }, { x: 2, y: 2 });

    assert.notEqual(path, null);
    assert.equal((path)?.length, 5);
    assert.equal(path?.some(point => point.x === 1 && point.y === 1), false);
  });

  test('returns null when start or goal is blocked', () => {
    const board = new GridBoard(2, 2);
    board.setObstacle(0, 0);
    assert.equal(board.findPath({ x: 0, y: 0 }, { x: 1, y: 1 }), null);
  });
});

describe('GridBoard dimension immutability', () => {
  test('does not allow callers to mutate dimensions after allocation', () => {
    const board = new GridBoard(3, 2);

    assert.throws(() => {
      (board as any).width = 100;
    }, TypeError);
    assert.throws(() => {
      (board as any).height = 100;
    }, TypeError);

    assert.equal(board.width, 3);
    assert.equal(board.height, 2);
    assert.equal(board.isValid(2, 1), true);
    assert.equal(board.isValid(3, 1), false);
  });
});

describe('Editable maps and reachability', () => {
  test('recomputes connected area after removing a wall', () => {
    const board = new GridBoard(3, 3);
    board.setObstacle(1, 0);
    board.setObstacle(1, 1);
    board.setObstacle(1, 2);
    assert.equal(board.reachableArea({ x: 0, y: 0 }), 3);
    assert.equal(board.findPath({ x: 0, y: 0 }, { x: 2, y: 0 }), null);
    board.clearObstacle(1, 1);
    assert.equal(board.reachableArea({ x: 0, y: 0 }), 7);
    assert.notEqual(board.findPath({ x: 0, y: 0 }, { x: 2, y: 0 }), null);
  });

  test('returns zero for blocked or invalid start', () => {
    const board = new GridBoard(2, 2);
    board.setObstacle(0, 0);
    assert.equal(board.reachableArea({ x: 0, y: 0 }), 0);
    assert.equal(board.reachableArea({ x: -1, y: 0 }), 0);
    assert.equal(board.reachableArea({ x: 0.5, y: 0 }), 0);
    board.clearObstacle(-1, 0);
    assert.equal(board.isObstacle(0, 0), true);
  });

  test('handles long corridors without recursive stack overflow', () => {
    const board = new GridBoard(1, 5000);
    assert.equal(board.reachableArea({ x: 0, y: 0 }), 5000);
  });

  test('counts the largest board and preserves distinct regions across a wall', () => {
    const board = new GridBoard(1000, 1000);
    assert.equal(board.reachableArea({ x: 0, y: 0 }), 1_000_000);
    for (let y = 0; y < 1000; y++) board.setObstacle(500, y);
    assert.equal(board.reachableArea({ x: 0, y: 0 }), 500_000);
    assert.equal(board.reachableArea({ x: 999, y: 999 }), 499_000);
  });
});

describe('GridBoard paths on wide and tall maps', () => {
  test('does not treat cells across a row boundary as neighbors', () => {
    const board = new GridBoard(2, 2);
    board.setObstacle(0, 0);
    board.setObstacle(1, 1);
    assert.equal(board.findPath({ x: 1, y: 0 }, { x: 0, y: 1 }), null);
  });

  test('returns a single point when the start is the goal', () => {
    const board = new GridBoard(1, 1);
    assert.deepEqual(board.findPath({ x: 0, y: 0 }, { x: 0, y: 0 }), [{ x: 0, y: 0 }]);
  });

  test('finds an ordered path in a tall corridor', () => {
    const board = new GridBoard(1, 50_000);
    const path = board.findPath({ x: 0, y: 49_999 }, { x: 0, y: 0 });
    assert.equal((path)?.length, 50_000);
    assert.deepEqual(path?.[0], { x: 0, y: 49_999 });
    assert.deepEqual(path?.[49_999], { x: 0, y: 0 });
  });
});
