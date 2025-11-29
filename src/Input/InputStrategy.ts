export interface InputStrategy {
    getHorizontal1(): number;
    getVertical1(): number;
    getHorizontal2(): number;
    getVertical2(): number;

    aButtonPressed(): boolean;
    bButtonPressed(): boolean;

    startButtonPressed(): boolean;

    update(): void;

    attach(): InputStrategy;
    detach(): void;
}