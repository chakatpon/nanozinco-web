/**
 * Unit Tests for UUID Utility
 * Following TDD methodology
 */

import { generateUUID } from '../uuid';

describe('UUID Utility - TDD Tests', () => {
  describe('generateUUID', () => {
    it('should generate a valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs on each call', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      const uuid3 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
      expect(uuid2).not.toBe(uuid3);
      expect(uuid1).not.toBe(uuid3);
    });

    it('should generate UUIDs with correct length (36 characters including hyphens)', () => {
      const uuid = generateUUID();
      expect(uuid.length).toBe(36);
    });

    it('should generate UUIDs with hyphens at correct positions', () => {
      const uuid = generateUUID();
      expect(uuid[8]).toBe('-');
      expect(uuid[13]).toBe('-');
      expect(uuid[18]).toBe('-');
      expect(uuid[23]).toBe('-');
    });

    it('should generate UUID with version 4 indicator (13th character is 4)', () => {
      const uuid = generateUUID();
      expect(uuid[14]).toBe('4');
    });

    it('should generate UUID with correct variant bits (17th character is 8, 9, a, or b)', () => {
      const uuid = generateUUID();
      const variantChar = uuid[19].toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });

    it('should generate 1000 unique UUIDs without collisions', () => {
      const uuids = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        uuids.add(generateUUID());
      }
      expect(uuids.size).toBe(1000);
    });

    it('should only use hexadecimal characters (0-9, a-f) and hyphens', () => {
      const uuid = generateUUID();
      const validCharsRegex = /^[0-9a-f-]+$/i;
      expect(uuid).toMatch(validCharsRegex);
    });
  });
});
