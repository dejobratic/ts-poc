export interface TimeProvider {
  now(): Date;
  timestamp(): number;
  addSeconds(date: Date, seconds: number): Date;
  addMinutes(date: Date, minutes: number): Date;
}

export class SystemTimeProvider implements TimeProvider {
  now(): Date {
    return new Date();
  }

  timestamp(): number {
    return Date.now();
  }

  addSeconds(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
  }

  addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }
}