/**
 * Timing utility for measuring async operation durations
 */

/**
 * Result from a timed operation
 */
export interface TimedResult<T> {
  result: T;
  duration: number;  // Duration in milliseconds
}

/**
 * Execute an async function and measure its duration
 *
 * @example
 * ```typescript
 * const { result: data, duration } = await withTiming(() => fetchData());
 * console.log(`Fetched in ${duration}ms`);
 * ```
 */
export async function withTiming<T>(
  fn: () => Promise<T>
): Promise<TimedResult<T>> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
}

/**
 * Execute a sync function and measure its duration
 *
 * @example
 * ```typescript
 * const { result: sorted, duration } = withTimingSync(() => array.sort());
 * console.log(`Sorted in ${duration}ms`);
 * ```
 */
export function withTimingSync<T>(fn: () => T): TimedResult<T> {
  const start = Date.now();
  const result = fn();
  const duration = Date.now() - start;
  return { result, duration };
}
