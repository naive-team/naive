import {PlayerAnimationState} from "./PlayerAnimationState";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Vector3} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";
import {PlayerCatchState} from "./PlayerCatchState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {SPACE} from "../../../Input/Keys";
import {EntityManager} from "../../../Entities/util/EntityManager";

export class PlayerWalkState implements PlayerAnimationState {
    onEnter(player: Player, _stateMachine: PlayerStateMachine): void {
        player.startAnimation("walk");
    }

    onLeave(player: Player, _stateMachine: PlayerStateMachine): void {
        player.stopAnimation("walk");
    }

    update(_player: Player, _stateMachine: PlayerStateMachine, _input: Input, _entityManager: EntityManager = null): void {
        if (_input.getInputVector().equals(Vector3.Zero())) {
            _stateMachine.changeState(_player, new PlayerIdleState());
        }

        if (_input.getPressed(SPACE)) {
            _stateMachine.changeState(_player, new PlayerCatchState());
        }

        _player.move(_input.getInputVector());
    }

}