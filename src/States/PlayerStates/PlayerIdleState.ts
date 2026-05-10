import {PlayerState} from "./PlayerState";
import {Input} from "../../Input/Input";
import {Player} from "../../Entities/Player";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Vector3} from "@babylonjs/core";
import {PlayerWalkState} from "./PlayerWalkState";
import {SPACE} from "../../Input/Keys";
import {PlayerCatchState} from "./PlayerCatchState";

export class PlayerIdleState implements PlayerState {

    constructor() {
    }

    update(player: Player, stateMachine: PlayerStateMachine, input: Input): void {
        if (! input.getInputVector().equals(Vector3.Zero())) {
            stateMachine.changeState(player, new PlayerWalkState());
        }

        if (input.getPressed(SPACE)) {
            stateMachine.changeState(player, new PlayerCatchState());
        }
    }

    onEnter(player: Player, stateMachine: PlayerStateMachine): void {
        player.startAnimation("idle");
    }

    onLeave(player: Player, stateMachine: PlayerStateMachine): void {
        player.stopAnimation("idle");
    }
}