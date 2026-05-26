import {AbstractMesh, Scene} from "@babylonjs/core";
import {Dialog} from "../Dialog/Dialog";

export class DialogRegister {

    static registerDialogue(mesh: AbstractMesh, dialog: Dialog, scene: Scene): void {
        mesh.onCollideObservable.add( () : void => {
            if (! dialog.started) {
                dialog.play(scene).then( () : void => {
                    dialog.started = true;
                });
            }
        });
    }
}