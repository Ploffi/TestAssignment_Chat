import React from 'react';
import { memo } from './memoize';

export interface IVirtualizerProps {
    oversizeAmount: number;
    minElementHeight: number;
    onChange: (start: number, end: number) => void;
    scrollableElement: HTMLElement | null;
    container: HTMLElement | null;
    total: number | undefined;
}

function findRange(containerTop: number, containerBottom: number, measures: IMeasure[], total: number): IRange {
    let startIdx = 0;

    while (containerTop >= measures[startIdx].bottom) {
        startIdx++;
    }

    let endIdx = startIdx;
    while (endIdx < total && containerBottom >= measures[endIdx].top) {
        endIdx++;
    }

    return [startIdx, endIdx];
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
        return findRange(
            this.scrollOffset,
            this.scrollOffset + this.scrollableElement.offsetHeight,
            this.calculateMeasures(),
            this.total,
        );
    }

    private initRange() {
        const estimatedHeight = this.total * this.minElementHeight;
        this.setTotalHeight(estimatedHeight);
        this.container.style.position = 'relative';

        this.heights = Array.from<number>({
            length: this.total,
        }).fill(this.minElementHeight);
        this.calculateMeasures();
    }

    private memoizedOnChange = memo(
        () => this.calculateRange(),
        (start, end) => {
            this.notify([start, end]);
        },
    );

    private subscribe() {
        const handler = () => {
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

    private calculateHeight(element: HTMLElement): number {
        const style = window.getComputedStyle(element);
        const result = ['height', 'margin-bottom', 'margin-top'].reduce(
            (acc, key) => parseInt(style[key as any], 10) + acc,
            0,
        );
        return Math.ceil(result);
    }

    private notify(range: [number, number]) {
        this.onChange(range);
    }

    destroy() {
        this.subs.forEach(unsubscribe => {
            unsubscribe();
        });
    }

    handleCreateElement = (element: HTMLElement | null) => {
        if (!element) return;

        const elementIdx = this.getElementIdx(element);

        if (elementIdx === undefined) return;

        const cachedHeight = this.heights[elementIdx];

        if (cachedHeight) {
            const currentHeight = this.calculateHeight(element);

            const delta = currentHeight - cachedHeight;

            if (delta !== 0) {
                this.heights[elementIdx] = currentHeight;
                this.startIdxToRecalculate = this.startIdxToRecalculate
                    ? Math.min(this.startIdxToRecalculate, elementIdx)
                    : elementIdx;

                const oldHeight = this.getTotalHeight();
                this.setTotalHeight(oldHeight + delta);
                this.memoizedOnChange();
            }
        } else {
            this.heights[elementIdx] = this.calculateHeight(element);
            this.memoizedOnChange();
        }
    };

    getElements = () => {
        const [startRange, endRange] = this.calculateRange();

        const start = Math.max(startRange - this.oversizeAmount, 0);
        const end = Math.min(endRange + this.oversizeAmount, this.total);

        return Array.from({ length: end - start }).map((_, i) => {
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

    private setTotalHeight(newHeight: number) {
        this.container.style.minHeight = newHeight + 'px';
    }

    getTotalHeight = () => {
        return parseInt(this.container.style.minHeight, 10);
    };
}

export const DATA_ATTRIBUTE_KEY = 'data-virtualized-idx';
