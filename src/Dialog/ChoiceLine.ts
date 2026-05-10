import {AbstractLine} from "./AbstractLine";
import {ChoiceUI} from "./ChoiceUI";
import * as GUI from "@babylonjs/gui";
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import { LineUi } from "./LineUi";

export class ChoiceLine extends AbstractLine {
    public setLineUi(lineUI: LineUi): void {
        // c est vide car on en a pas besoin pour choice
        lineUI = lineUI;
    }
    choices : string[];
    possibleNextLines : AbstractLine[];
    uiChoice : ChoiceUI;


    constructor(textLine: string, choices : string[],
                possibleNextLines : AbstractLine[])
    {
        super(textLine);
        this.possibleNextLines = possibleNextLines;
        this.choices = choices;

    }
    public createUi(uiGlobale: AdvancedDynamicTexture) {
        this.uiChoice = new ChoiceUI(uiGlobale, this.choices);
    }

    public display(): void {
        this.uiChoice.show();
    }

    public hide(): void {
        this.uiChoice.hide();
    }
    public override hasNext() : boolean {
        return this.possibleNextLines != null && this.possibleNextLines.length > 0;
    }
    public async getNextLine(): Promise<AbstractLine | null> {

        if (!this.hasNext()) {
            return null;
        }

        this.display();
        const index = await this.uiChoice.waitForChoice();


        if (index  < 0 || index >= this.possibleNextLines.length) {// c est juste pour eviter un bug bidon
            return this.possibleNextLines[0];
        }
        return this.possibleNextLines[index];
    }

}