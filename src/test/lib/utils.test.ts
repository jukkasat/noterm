import { describe, it, expect } from 'vitest';
import { clamp, generateId, getFontClass, getFontStyles } from '@/lib/utils';

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

describe('getFontStyles', () => {
  it('should return an array of font style options', () => {
    const fontStyles = getFontStyles();
    expect(fontStyles).toHaveLength(4);
  });

  it('should include handwriting font style', () => {
    const fontStyles = getFontStyles();
    const handwriting = fontStyles.find(style => style.value === 'handwriting');
    expect(handwriting).toBeDefined();
    expect(handwriting?.label).toBe('Handwriting');
  });

  it('should include sans-serif font style', () => {
    const fontStyles = getFontStyles();
    const sansSerif = fontStyles.find(style => style.value === 'sans-serif');
    expect(sansSerif).toBeDefined();
    expect(sansSerif?.label).toBe('Sans Serif');
  });

  it('should include serif font style', () => {
    const fontStyles = getFontStyles();
    const serif = fontStyles.find(style => style.value === 'serif');
    expect(serif).toBeDefined();
    expect(serif?.label).toBe('Serif');
  });

  it('should include monospace font style', () => {
    const fontStyles = getFontStyles();
    const monospace = fontStyles.find(style => style.value === 'monospace');
    expect(monospace).toBeDefined();
    expect(monospace?.label).toBe('Monospace');
  });
});

describe('getFontClass', () => {
  it('should return correct class for handwriting', () => {
    expect(getFontClass('handwriting')).toBe('font-handwriting');
  });

  it('should return correct class for sans-serif', () => {
    expect(getFontClass('sans-serif')).toBe('font-sans');
  });

  it('should return correct class for serif', () => {
    expect(getFontClass('serif')).toBe('font-serif');
  });

  it('should return correct class for monospace', () => {
    expect(getFontClass('monospace')).toBe('font-mono');
  });
});