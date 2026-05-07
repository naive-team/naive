import {AbstractLine} from "./AbstractLine";

export abstract class Dialog {
    // TODO stoquer line 1
    // definir toutes les lines
    // afficher
    firstLine: AbstractLine;
    currentLine: AbstractLine;
    Lines: AbstractLine[];

    public play(): void {
        while(this.currentLine.hasNext()){
            // TODO afficher la ligne 1
            //  attendre next
            //  changer le texte
        }

}
}