// DialogNode.ts
import {Dialog} from "./Dialog";

export interface DialogNode {
    dialog: Dialog;
    // Transitions fixes (fin de dialog → dialog suivant)
    defaultNext?: number; // index dans le graphe
    // Transitions conditionnelles par choix
    choiceTransitions?: Map<number, number>; // choiceIndex → nodeIndex
}

// DialogGraph.ts
export class DialogGraph {
    private nodes: DialogNode[];
    private currentNodeIndex: number = 0;

    constructor() {

    }

    getCurrentDialog(): Dialog {
        return this.nodes[this.currentNodeIndex].dialog;
    }

    // Appelé par le NPC quand un Dialog se termine
    transitionTo(choiceIndex?: number): boolean {
        const node = this.nodes[this.currentNodeIndex];

        let nextIndex: number | undefined;

        if (choiceIndex !== undefined && node.choiceTransitions) {
            nextIndex = node.choiceTransitions.get(choiceIndex);
        }
        nextIndex ??= node.defaultNext;

        if (nextIndex === undefined) return false; // fin du graphe

        this.currentNodeIndex = nextIndex;
        return true;
    }
    public setNodes(nodes: DialogNode[]) {
        this.nodes = nodes;
    }
}