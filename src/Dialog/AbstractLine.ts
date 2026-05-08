import {LineUi} from "./LineUi";
import * as GUI from "@babylonjs/gui";

export abstract class AbstractLine {
    oratorName: string;
    texteLine: string;

    constructor(texteLine: string) {
        this.texteLine = texteLine;
    }
    abstract display(): void;
    abstract hide(): void;
    abstract createUi(uiGlobale:  GUI.AdvancedDynamicTexture): void;
    public abstract getNextLine(): Promise<AbstractLine>;
    public abstract hasNext(): boolean;
    public getOratorName(): string {
        return this.oratorName;
    }
    public getText(): string{
        return this.texteLine;
    };
}