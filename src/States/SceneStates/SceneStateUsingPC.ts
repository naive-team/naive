import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EXIT_BUTTON, TAB} from "../../Input/Keys";
import {SceneStatePlaying} from "./SceneStatePlaying";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {GameContext} from "../../util/GameContext";
import {PC} from "../../Entities/PC";
import {Player} from "../../Entities/Player";

import {FreeCamera, Matrix, Tools, Vector3} from "@babylonjs/core";
import {KeyboardSwitcherUI} from "../../UI/KeyBoardSwitcherUI";

export class SceneStateUsingPC implements SceneState {
    private pc_: PC;
    private ui:KeyboardSwitcherUI = new KeyboardSwitcherUI();


    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.input.update();
        this.pc_.update(ctx);

        if (ctx.input.getPressed(EXIT_BUTTON) || this.pc_.getExitFlag()) {
            stateMachine.changeState(new SceneStatePlaying(), ctx);
        }
        if (ctx.input.getJustPressed(TAB)){
            ctx.input.switchStrategy();
            this.ui.switch();
        }
    }

    onEnter(_stateMachine: SceneStateMachine, ctx: GameContext): void {

        this.pc_ = ctx.entityManager.getEntityByFamily(EntityFamily.PC) as PC;
        this.pc_.turnOn();

        const collider = this.pc_.getCollider();
        const angle = collider.rotation.y; // ou rotationQuaternion si tu utilises des quaternions

        const localOffset = new Vector3(0, 0.5, 0.4);

        const rotatedOffset = Vector3.TransformCoordinates(
            localOffset,
            Matrix.RotationY(angle)
        );

        const cam = new FreeCamera(
            "pcCam",
            collider.position.add(rotatedOffset),
            collider.getScene()
        );
        cam.rotation.y = angle + Tools.ToRadians(180);
        this.pc_.getCollider().getScene().activeCamera = cam;

        (ctx.entityManager.getEntityByFamily(EntityFamily.PLAYER) as Player).setVisible(false);
        this.ui.show()
    }

    onLeave(_state: SceneStateMachine, ctx: GameContext): void {
        this.pc_.turnOff();

        ctx.playerCamera.lockOnEntity(ctx.entityManager.getEntityByFamily(EntityFamily.PLAYER).getCollider());
        ctx.playerCamera.radius = 10;

        ctx.playerCamera.attachControl(ctx.canvas);

        const oldCamera = this.pc_.getCollider().getScene().activeCamera;
        this.pc_.getCollider().getScene().activeCamera = ctx.playerCamera;

        (ctx.entityManager.getEntityByFamily(EntityFamily.PLAYER) as Player).setVisible(true);
        oldCamera.dispose();
        this.ui.hide();
    }
}