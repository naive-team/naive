import {AbstractLine} from "./AbstractLine";
import {ChoiceUI} from "./ChoiceUI";
import * as GUI from "@babylonjs/gui";

export class ChoiceLine extends AbstractLine {
    choices : string[];
    possibleLines : AbstractLine[];
    uiChoice : ChoiceUI;

    constructor(choices : string[],
                possibleLines : AbstractLine[],
                ui: GUI.AdvancedDynamicTexture)
    {
        super(" ");
        this.possibleLines = possibleLines;
        this.choices = choices;
        this.uiChoice = new ChoiceUI(ui, choices)
    }
    public display(): void {
        this.uiChoice.show();
    }

    public hide(): void {
        this.uiChoice.hide();
    }
    public override hasNext() : boolean {
        return this.possibleLines != null && this.possibleLines.length > 0;
    }
    public async getNextLine(): Promise<AbstractLine | null> {

        if (!this.hasNext()) {
            return null;
        }

        this.display();
        const index = await this.uiChoice.waitForChoice();


        if (index  < 0 || index >= this.possibleLines.length) {// c est juste pour eviter un bug bidon
            return this.possibleLines[0];
        }
        return this.possibleLines[index];
    }

}