import {Dialog} from "../Dialog";
import {AbstractMesh, ActionManager, ExecuteCodeAction, KeyboardEventTypes, MeshBuilder, Scene} from "@babylonjs/core";
import {DialogGraph} from "../DialogNode";
import {InteractUI} from "../../UI/interactUI";
import {InteractTrigger} from "../../util/InteractTrigger";

export class Speaker {
    dialogGraph: DialogGraph = new DialogGraph();
    name: string;
    currentDialogIndex: number;
    mesh: AbstractMesh;
    collider_: AbstractMesh;
    ui: InteractUI;

    constructor(name: string, mesh: AbstractMesh, _scene: Scene, _playermesh: AbstractMesh) {
        this.name = name;
        this.currentDialogIndex = 0;
        this.mesh = mesh;
        this.mesh.getChildMeshes().forEach(child => {
            child.checkCollisions = true;
        });
        this.mesh.checkCollisions = true;
        this.collider_ = MeshBuilder.CreateBox("speaker_collider", {
            width: 4,
            depth: 3,
            height: 4
        });
        this.collider_.isVisible = true;
        this.mesh.parent = this.collider_;
        this.ui = new InteractUI("Parler");
        InteractTrigger.init(_playermesh, _scene, this.collider_, this.ui,(scene: Scene) => this.interact(scene));
        //this.init(playermesh, scene);

        //this.setRegisterDialog(scene);

    }

    async interact(scene: Scene) {
        const dialog = this.dialogGraph.getCurrentDialog();
        if (!dialog.started) {
            dialog.started = true;
            const choiceIndex = await dialog.play(scene);
            dialog.started = false;
            this.dialogGraph.transitionTo(choiceIndex);
        }
    }

    public speak(_scene: Scene): void {
        //this.dialogGraph[this.currentDialogIndex].play(scene);
    }

    public setCurrentDialogIndex(index: number): void {
        this.currentDialogIndex = index;
    }

    showInteractUi(): void {
        this.ui.show();
    }

    /*async (): Promise<void> => {
                    await this.interact(scene);
                }*/
    protected init(playerMesh: AbstractMesh, scene: Scene): void {
        const targetMesh = this.collider_;
        let isInside = false;

        targetMesh.actionManager = new ActionManager(scene);

        // Entrée
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionEnterTrigger, parameter: playerMesh},
                (): void => {
                    isInside = true;
                    this.showInteractUi();
                }
            )
        );

        // Sortie
        targetMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionExitTrigger, parameter: playerMesh},
                (): void => {
                    isInside = false;
                    this.ui.hide();
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
                this.ui.hide();
                await this.interact(scene);
                this.showInteractUi()
            }
        });
    }
}