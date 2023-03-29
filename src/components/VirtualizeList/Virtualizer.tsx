import React from 'react';
import { memo } from '../../utils/memoize';

export interface IVirtualizerProps {
    oversizeAmount: number;
    minElementHeight: number;
    onChange: (start: number, end: number) => void;
    scrollElement: HTMLElement | null;
    container: HTMLElement | null;
    total: number | undefined;
}

function findStartByBinarySearch(measures: IMeasure[], containerTop: number, total: number) {
    let left = 0;
    let right = total;

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        const middleTop = measures[middle].top;

        if (middleTop < containerTop) {
            left = middle + 1;
        } else if (middleTop > containerTop) {
            right = middle - 1;
        } else {
            return middle;
        }
    }

    return left === 0 ? 0 : left - 1;
}

function findRange(containerTop: number, containerBottom: number, measures: IMeasure[], total: number): IRange {
    const startIdx = findStartByBinarySearch(measures, containerTop, total);

    let endIdx = startIdx;
    while (endIdx < total - 1 && containerBottom >= measures[endIdx].top) {
        endIdx++;
    }

    return [startIdx, endIdx];
}

function calculateHeight(element: HTMLElement): number {
    const style = window.getComputedStyle(element);
    const result = ['height', 'margin-bottom', 'margin-top'].reduce(
        (acc, key) => parseInt(style[key as any], 10) + acc,
        0,
    );
    return Math.ceil(result);
}

interface IMeasure {
    height: number;
    top: number;
    bottom: number;
}

type IRange = [number, number];

export class Virtualizer {
    private heights: number[];
    private measuresCache: IMeasure[];
    private subs: Function[] = [];
    private scrollOffset: number;
    private startIdxToRecalculate: number | null = null;

    constructor(
        private scrollableElement: HTMLElement,
        private container: HTMLElement,
        private onChange: (range: IRange) => void,
        private oversizeAmount: IVirtualizerProps['oversizeAmount'],
        private minElementHeight: IVirtualizerProps['minElementHeight'],
        private total: number,
    ) {
        this.heights = [];
        this.measuresCache = [];
        this.scrollOffset = this.scrollableElement.scrollTop;
        this.subscribe();
        this.initRange();
    }

    private initRange() {
        this.totalHeight = this.total * this.minElementHeight;
        this.container.style.position = 'relative';

        this.heights = Array.from<number>({
            length: this.total,
        }).fill(this.minElementHeight);
        this.calculateMeasures();
    }

    private calculateMeasures(): IMeasure[] {
        const startIdx = this.startIdxToRecalculate === null ? 0 : this.startIdxToRecalculate;
        const measures = this.measuresCache.slice(0, startIdx);

        for (let i = startIdx; i < this.total; i++) {
            const start = i > 0 ? measures[i - 1].bottom : 0;
            const height = this.heights[i];
            const end = start + height;

            measures[i] = {
                top: start,
                bottom: end,
                height: height,
            };
        }

        this.measuresCache = measures;

        return measures;
    }

    private calculateRange(): IRange {
        const [startRange, endRange] = findRange(
            this.scrollOffset,
            this.scrollOffset + this.scrollableElement.offsetHeight,
            this.calculateMeasures(),
            this.total,
        );

        const start = Math.max(startRange - this.oversizeAmount, 0);
        const end = Math.min(endRange + this.oversizeAmount, this.total - 1);

        return [start, end];
    }

    private memoizedOnChange = memo(
        () => this.calculateRange(),
        (start, end) => {
            this.notify([start, end]);
        },
    );

    private scrollAdjustments: number = 0;
    private subscribe() {
        const handler = () => {
            this.scrollAdjustments = 0;
            const currentOffset = this.scrollableElement.scrollTop;
            if (currentOffset === this.scrollOffset) return;

            this.scrollOffset = currentOffset;
            this.memoizedOnChange();
        };
        this.scrollableElement.addEventListener('scroll', handler, {
            // improve scrolling performance
            // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners
            passive: true,
        });
        this.subs.push(() => this.scrollableElement.removeEventListener('scroll', handler));
    }

    private getElementIdx(element: HTMLElement) {
        const idxStr = element.getAttribute(DATA_ATTRIBUTE_KEY);
        if (!idxStr) return;
        const parsed = Number.parseInt(idxStr, 10);

        return Number.isNaN(parsed) ? undefined : parsed;
    }

    private notify(range: [number, number]) {
        this.onChange(range);
    }

    private scrolledToBottom = false;

    didUpdate() {
        if (this.scrolledToBottom) return;
        const currentRange = this.calculateRange();
        if (currentRange.every(i => this.mounted.has(i))) {
            this.scrolledToBottom = true;
        }
        this.scrollableElement.scrollTo(0, this.scrollableElement.scrollHeight);
    }

    destroy() {
        this.subs.forEach(unsubscribe => {
            unsubscribe();
        });
    }

    private mounted = new Set<number>();
    handleCreateElement = (element: HTMLElement | null) => {
        if (!element) return;

        const elementIdx = this.getElementIdx(element);

        if (elementIdx === undefined) return;

        const cachedHeight = this.heights[elementIdx];

        const currentHeight = calculateHeight(element);

        const delta = currentHeight - cachedHeight;

        if (!this.scrolledToBottom && element.getAttribute('data-virtualized-ready') === 'true') {
            this.mounted.add(elementIdx);
        }

        if (delta !== 0) {
            if (this.measuresCache[elementIdx] && this.measuresCache[elementIdx].top < this.scrollOffset) {
                this.scrollAdjustments += delta;

                const toOffset = this.scrollOffset + this.scrollAdjustments;

                this.scrollableElement.scrollTo({
                    top: toOffset,
                });
            }

            this.heights[elementIdx] = currentHeight;

            this.startIdxToRecalculate = this.startIdxToRecalculate
                ? Math.min(this.startIdxToRecalculate, elementIdx)
                : elementIdx;

            this.totalHeight += delta;
            this.memoizedOnChange();
        }
    };

    getElements = () => {
        const [start, end] = this.calculateRange();

        return Array.from({ length: end - start + 1 }).map((_, i) => {
            const idx = start + i;
            let measure = this.measuresCache[idx];

            return {
                idx,
                height: measure.height,
                start: measure.top,
                end: measure.bottom,
            };
        });
    };

    private totalHeight: number = 0;
    getTotalHeight = () => {
        return this.totalHeight;
    };
}

export const DATA_ATTRIBUTE_KEY = 'data-virtualized-idx';
