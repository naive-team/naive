
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {EntityManager} from "../../../Entities/util/EntityManager";

export interface PlayerAnimationState {
    update(_player: Player, _stateMachine: PlayerStateMachine, _input: Input, _entityManager: EntityManager): void;
    onEnter(player: Player, stateMachine: PlayerStateMachine): void;
    onLeave(player: Player, stateMachine: PlayerStateMachine): void;
}