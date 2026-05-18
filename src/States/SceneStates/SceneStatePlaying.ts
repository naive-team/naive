import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {Input} from "../../Input/Input";
import {EntityManager} from "../../Entities/util/EntityManager";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {Player} from "../../Entities/Player";
import {DIALOG_BUTTON} from "../../Input/Keys";
import {SceneStateUsingPC} from "./SceneStateUsingPC";
import {GameContext} from "../../util/GameContext";


export class SceneStatePlaying implements SceneState {
    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.entityManager.updateAll();
        ctx.input.update();

        this.checkPCActivation_(stateMachine, ctx);
    }

    private checkPCActivation_(stateMachine: SceneStateMachine, ctx: GameContext): void {
        const player: Player = ctx.entityManager.getEntityByFamily(EntityFamily.PLAYER) as Player;

        if (player.isNearPC(ctx.entityManager) && ctx.input.getPressed(DIALOG_BUTTON)) {
            stateMachine.changeState(new SceneStateUsingPC(), ctx);
        }
    }

    onEnter(_stateMachine: SceneStateMachine, _ctx: GameContext): void {
    }
}