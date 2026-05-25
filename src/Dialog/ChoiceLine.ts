import {AbstractLine} from "./AbstractLine";
import {ChoiceUI} from "./ChoiceUI";
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import { LineUi } from "./LineUi";

export class ChoiceLine extends AbstractLine {


    choices : string[];
    possibleNextLines : AbstractLine[];
    uiChoice : ChoiceUI;
    onChoiceMade?: (choiceIndex: number) => void;
    public lastChoiceIndex: number | undefined;


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

        this.onChoiceMade?.(index); // ← notifie le NPC
        this.lastChoiceIndex = index;
        return this.possibleNextLines[index];
    }
    public setLineUi(_lineUI: LineUi): void {
        //pas de texte de line pour un choix
    }
}