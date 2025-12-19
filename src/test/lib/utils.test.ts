import { describe, it, expect } from 'vitest';
import { clamp, generateId } from '../../lib/utils';

describe('clamp', () => {
  it('should return the value if it is within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should return the minimum value if the value is below the range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should return the maximum value if the value is above the range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('generateId', () => {
  it('should generate a valid UUID format', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should fallback gracefully if crypto.randomUUID is not available', () => {
    const originalRandomUUID = crypto.randomUUID;
    // @ts-expect-error - Testing fallback behavior
    delete crypto.randomUUID;

    const id = generateId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');

    crypto.randomUUID = originalRandomUUID;
  });
});