import {AbstractMesh, ActionManager, ExecuteCodeAction, KeyboardEventTypes, Scene} from "@babylonjs/core";
import {InteractUI} from "../UI/interactUI";

export class InteractTrigger {
    static init(playerMesh: AbstractMesh, scene: Scene, collider:AbstractMesh, ui: InteractUI, action: (scene:Scene) => Promise<void>): void {
        const targetMesh = collider;
        let isInside = false;

        targetMesh.actionManager = new ActionManager(scene);

        // Entrée
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionEnterTrigger, parameter: playerMesh},
                (): void => {
                    isInside = true;
                    ui.show();
                }
            )
        );

        // Sortie
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionExitTrigger, parameter: playerMesh},
                (): void => {
                    isInside = false;
                    ui.hide();
                }
            )
        );

        // Appui sur F
        scene.onKeyboardObservable.add(async (kbInfo) => {
            if (
                kbInfo.type === KeyboardEventTypes.KEYDOWN &&
                kbInfo.event.key === "f" &&
                isInside
            ) {
                ui.hide();
                await action(scene);
                ui.show();

            }
        });
    }
}