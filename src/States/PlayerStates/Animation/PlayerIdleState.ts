import {PlayerAnimationState} from "./PlayerAnimationState";

import {PlayerStateMachine} from "./PlayerStateMachine";
import {Vector3} from "@babylonjs/core";
import {PlayerWalkState} from "./PlayerWalkState";
import {PlayerCatchState} from "./PlayerCatchState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {ACTION_BUTTON} from "../../../Input/Keys";
import {EntityManager} from "../../../Entities/util/EntityManager";

export class PlayerIdleState implements PlayerAnimationState {

    constructor() {
    }

    update(_player: Player, _stateMachine: PlayerStateMachine, _input: Input, _entityManager: EntityManager): void {
        if (! _input.getInputVector().equals(Vector3.Zero())) {
            _stateMachine.changeState(_player, new PlayerWalkState());
        }

        if (_input.getPressed(ACTION_BUTTON)) {
            _stateMachine.changeState(_player, new PlayerCatchState());
        }
    }

    onEnter(player: Player, _stateMachine: PlayerStateMachine): void {
        player.startAnimation("idle");
    }

    onLeave(player: Player, _stateMachine: PlayerStateMachine): void {
        player.stopAnimation("idle");
    }
}