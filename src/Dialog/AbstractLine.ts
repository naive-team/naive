import {LineUi} from "./LineUi";
import * as GUI from "@babylonjs/gui";

export abstract class AbstractLine {
    oratorName: string;
    nextLine: AbstractLine;
    texteLine: string;
    uiGlobale : GUI.AdvancedDynamicTexture;

    public show(){
        //TODO voir comment lq supprimer peut lq stoquer comme attribut ou alors dans dialogue ? (et on chqnge juste le texte dqns les line)
        new LineUi(this.uiGlobale, this.getText()).show();
    }
    public abstract getNextLine(): AbstractLine;
    public hasNext(): boolean {
        return this.nextLine != null;
    }
    public getOratorName(): string {
        return this.oratorName;
    }
    public getText(): string{
        return this.texteLine;
    };
}