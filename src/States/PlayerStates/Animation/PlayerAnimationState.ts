
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";

export interface PlayerAnimationState {
    update(player: Player, stateMachine: PlayerStateMachine, input: Input): void;
    onEnter(player: Player, stateMachine: PlayerStateMachine): void;
    onLeave(player: Player, stateMachine: PlayerStateMachine): void;
}