import {AbstractLine} from "./AbstractLine";

export class ChoiceLine extends AbstractLine {
    choices : string[];
    possibleLines : AbstractLine[];

    public override hasNext() : boolean {
        return this.possibleLines != null && this.possibleLines.length < 0;
    }
    public getNextLine(): AbstractLine {

        if (!this.hasNext()) {
            return null;
        }

        let index: number = -1;
        // TODO afficher l ui de choix, recuperer la valeur
        // on attend l input avant de continuer

        if (index <= -1 || index > this.possibleLines.length) {// c est juste pour eviter un bug bidon
            return this.possibleLines[0];
        }
        return this.possibleLines[index];
    }

}