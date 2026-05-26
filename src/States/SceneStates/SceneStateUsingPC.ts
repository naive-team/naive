import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EXIT_BUTTON} from "../../Input/Keys";
import {SceneStatePlaying} from "./SceneStatePlaying";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {GameContext} from "../../util/GameContext";
import {PC} from "../../Entities/PC";
import {Player} from "../../Entities/Player";

import {FreeCamera, Tools} from "@babylonjs/core";

export class SceneStateUsingPC implements SceneState {
    private pc_: PC;


    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.input.update();
        this.pc_.update(ctx);

        if (ctx.input.getPressed(EXIT_BUTTON) || this.pc_.getExitFlag()) {
            stateMachine.changeState(new SceneStatePlaying(), ctx);
        }
    }

    onEnter(_stateMachine: SceneStateMachine, ctx: GameContext): void {

        this.pc_ = ctx.entityManager.getEntityByFamily(EntityFamily.PC) as PC;
        this.pc_.turnOn();

        const cam = new FreeCamera("pcCam", this.pc_.getCollider().position.clone(), this.pc_.getCollider().getScene());
        cam.rotation.y = Tools.ToRadians(180);
        cam.position.z = 0.5;
        cam.position.y = 1.2;
        this.pc_.getCollider().getScene().activeCamera = cam;

        (ctx.entityManager.getEntityByFamily(EntityFamily.PLAYER) as Player).setVisible(false);
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
    }
}