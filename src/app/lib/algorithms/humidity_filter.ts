export type AlertStatus = 'NOMINAL' | 'WARNING' | 'CRITICAL';

export class HumidityMonitor {
    private window: number[] = [];
    private readonly maxWindowSize: number;

    constructor(windowSize: number = 3) {
        this.maxWindowSize = windowSize;
    }

    /**
     * Pushes new raw humidity data into the sliding window queue
     * and returns the computed moving average
     * @param rawHumidity an incoming new reading of the humidity
     * @returns The average humidity with the latest new reading
     */
    public addReading(rawHumidity: number): number {
        this.window.push(rawHumidity);

        // Evict oldest element if window exceeds size contraint
        if (this.window.length > this.maxWindowSize) {
            this.window.shift();
        }

        // Compute the moving average with a O(k) where k >= maxWindowSize
        const sum = this.window.reduce((acc, val) => acc + val, 0);
        return parseFloat((sum/ this.window.length).toFixed(2));
    }

    /**
     * Evaluate the status of the average humidity against the threshold
     * @param avgHumidity Computed average humidity
     * @returns An Alert status for risk of mold
     */
    public alertLevel(averageHumidity: number): AlertStatus {
        if (averageHumidity > 65.0) {
            return 'CRITICAL'; // Mold growth risk for paper collections
        } else if (averageHumidity > 55.0) {
            return 'WARNING'
        }
        return 'NOMINAL';
    }
}
