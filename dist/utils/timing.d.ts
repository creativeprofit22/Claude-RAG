/**
 * Timing utility for measuring async operation durations
 */
/**
 * Result from a timed operation
 */
export interface TimedResult<T> {
    result: T;
    duration: number;
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
export declare function withTiming<T>(fn: () => Promise<T>): Promise<TimedResult<T>>;
/**
 * Execute a sync function and measure its duration
 *
 * @example
 * ```typescript
 * const { result: sorted, duration } = withTimingSync(() => array.sort());
 * console.log(`Sorted in ${duration}ms`);
 * ```
 */
export declare function withTimingSync<T>(fn: () => T): TimedResult<T>;
//# sourceMappingURL=timing.d.ts.map