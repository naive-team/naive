import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {Player} from "../../Entities/Player";
import {DIALOG_BUTTON} from "../../Input/Keys";
import {SceneStateUsingPC} from "./SceneStateUsingPC";
import {GameContext} from "../../util/GameContext";
import {CALISpeaker} from "../../Dialog/Speaker/CALISpeaker";
import {SceneStateDialog} from "./SceneStateDialog";


export class SceneStatePlaying implements SceneState {
    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.entityManager.updateAll(ctx);
        ctx.input.update();

        this.checkPCActivation_(stateMachine, ctx);
        this.checkCALIDialog_(stateMachine, ctx);
    }

    private checkPCActivation_(stateMachine: SceneStateMachine, ctx: GameContext): void {
        const player: Player = ctx.entityManager.getEntityByFamily(EntityFamily.PLAYER) as Player;

        if (player === undefined) {
            console.log("player undefined");
            return;
        }

        if (player.isNearPC(ctx.entityManager) && ctx.input.getPressed(DIALOG_BUTTON)) {
            stateMachine.changeState(new SceneStateUsingPC(), ctx);
        }
    }

    private checkCALIDialog_(stateMachine: SceneStateMachine, ctx: GameContext): void {
        const cali: CALISpeaker = ctx.entityManager.getEntityByFamily(EntityFamily.CALI) as CALISpeaker;


        if (cali === undefined) {
            console.log("cali undefined");
            return;
        }

        if (cali.wantsToSpeak()) {
            stateMachine.changeState(new SceneStateDialog(cali), ctx);
        }
    }

    onEnter(_stateMachine: SceneStateMachine, _ctx: GameContext): void {
    }

    onLeave(_state: SceneStateMachine, _ctx: GameContext): void {
    }
}