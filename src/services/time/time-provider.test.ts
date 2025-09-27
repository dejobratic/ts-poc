import { SystemTimeProvider } from '@/services/time/time-provider';

describe('SystemTimeProvider', () => {
  let timeProvider: SystemTimeProvider;

  beforeEach(() => {
    timeProvider = new SystemTimeProvider();
  });

  describe('now', () => {
    it('should return current date', () => {
      const before = new Date();
      const result = timeProvider.now();
      const after = new Date();

      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('timestamp', () => {
    it('should return current timestamp', () => {
      const before = Date.now();
      const result = timeProvider.timestamp();
      const after = Date.now();

      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });
  });

  describe('addSeconds', () => {
    it('should add seconds to date', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addSeconds(baseDate, 30);

      expect(result).toEqual(new Date('2023-01-01T12:00:30Z'));
    });

    it('should handle negative seconds', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addSeconds(baseDate, -30);

      expect(result).toEqual(new Date('2023-01-01T11:59:30Z'));
    });

    it('should handle zero seconds', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addSeconds(baseDate, 0);

      expect(result).toEqual(baseDate);
      expect(result).not.toBe(baseDate); // Should be new instance
    });
  });

  describe('addMinutes', () => {
    it('should add minutes to date', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addMinutes(baseDate, 5);

      expect(result).toEqual(new Date('2023-01-01T12:05:00Z'));
    });

    it('should handle negative minutes', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addMinutes(baseDate, -10);

      expect(result).toEqual(new Date('2023-01-01T11:50:00Z'));
    });

    it('should handle zero minutes', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addMinutes(baseDate, 0);

      expect(result).toEqual(baseDate);
      expect(result).not.toBe(baseDate); // Should be new instance
    });

    it('should handle fractional minutes', () => {
      const baseDate = new Date('2023-01-01T12:00:00Z');
      const result = timeProvider.addMinutes(baseDate, 1.5);

      expect(result).toEqual(new Date('2023-01-01T12:01:30Z'));
    });
  });
});