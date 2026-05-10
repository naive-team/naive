import {Input} from "../../Input/Input";
import {Player} from "../../Entities/Player";
import {PlayerStateMachine} from "./PlayerStateMachine";

export interface PlayerState {
    update(player: Player, stateMachine: PlayerStateMachine, input: Input): void;
    onEnter(player: Player, stateMachine: PlayerStateMachine): void;
    onLeave(player: Player, stateMachine: PlayerStateMachine): void;
}