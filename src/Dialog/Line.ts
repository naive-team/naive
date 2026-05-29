import {AbstractLine} from "./AbstractLine";
import { LineUi } from "./LineUi";
import {SimpleLineUi} from "./SimpleLineUi";
import * as GUI from "@babylonjs/gui";

export class Line extends AbstractLine {

    nextLine: AbstractLine | null;
    ui: SimpleLineUi;
    lineUi: LineUi;
    action: ()=>void;

    public setLineUi(lineUI: LineUi): void {
        this.lineUi = lineUI;
    }
    private resolveNext: ((line: AbstractLine | null) => void) | null = null;

    constructor(text: string, nextLine: AbstractLine | null, action: ()=>void = ()=>{}) {
        super(text);
        this.nextLine = nextLine;
        this.action = action;

    }
    public createUi(uiGlobale:  GUI.AdvancedDynamicTexture): void {
        this.ui = new SimpleLineUi(uiGlobale)
    }
    public display(): void {
        this.ui.show();
        this.ui.onNextClicked(() => this.onNextButtonPressed());
        this.action();
    }

    public hide(): void {
        this.ui.hide();
    }

    public getNextLine(): Promise<AbstractLine | null> {
        return new Promise((resolve) => {
            this.resolveNext = resolve;
        });
    }

    public hasNext(): boolean {
        return this.nextLine !== null;
    }

    public onNextButtonPressed(): void {
        if (this.lineUi.skipAnimation(this.texteLine)) {
            //console.log("onNextButtonPressed, skip anim");
            return;
        }

        if (this.resolveNext) {
            this.resolveNext(this.nextLine);
            this.resolveNext = null;
        }
    }
}