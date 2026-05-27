import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {GameContext} from "../../util/GameContext";
import {Speaker} from "../../Dialog/Speaker/Speaker";
import {SceneStatePlaying} from "./SceneStatePlaying";
import {Player} from "../../Entities/Player";

export class SceneStateDialog implements SceneState {

    constructor(private speaker_: Speaker) {}

    onEnter(_state: SceneStateMachine, ctx: GameContext): void {
        const player: Player = ctx.entityManager.getPlayer();

        player.setCanMove(false);
        player.stopAnimation("walk");
        player.startAnimation("idle");
    }

    onLeave(_state: SceneStateMachine, ctx: GameContext): void {
        const player: Player = ctx.entityManager.getPlayer();

        player.setCanMove(true);
    }

    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.input.update();

        if (! this.speaker_.wantsToSpeak()) {
           stateMachine.changeState(new SceneStatePlaying(), ctx);
           return;
        }

    }
}