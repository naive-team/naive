import {AbstractLine} from "./AbstractLine";
import {SimpleLineUi} from "./SimpleLineUi";

export class Line extends AbstractLine {
    nextLine: AbstractLine | null;
    private resolveNext: ((line: AbstractLine | null) => void) | null = null;

    constructor(text: string, nextLine: AbstractLine | null) {
        super(text);
        this.nextLine = nextLine;

    }

    public getNextLine(): Promise<AbstractLine | null> {
        return new Promise((resolve) => {
            this.resolveNext = resolve;
        });
    }

    public hasNext(): boolean {
        return this.nextLine !== null;
    }

    // À appeler quand le joueur clique sur "Next"
    public onNextButtonPressed(): void {
        if (this.resolveNext) {
            this.resolveNext(this.nextLine);
            this.resolveNext = null;
        }
    }
}