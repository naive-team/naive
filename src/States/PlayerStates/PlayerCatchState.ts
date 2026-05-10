import {PlayerState} from "./PlayerState";
import {Player} from "../../Entities/Player";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Input} from "../../Input/Input";
import {ITimerOptions, setAndStartTimer, Scene} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";

export class PlayerCatchState implements PlayerState {


    constructor() {

    }

    onEnter(player: Player, stateMachine: PlayerStateMachine): void {
        player.startAnimation("catch");

        const timerOptions: ITimerOptions<Scene> = {
            timeout: 2000,
            contextObservable: player.getScene().onBeforeRenderObservable,

            onEnded: () => {
                stateMachine.changeState(player, new PlayerIdleState());
            }
        }

        setAndStartTimer(timerOptions);
    }

    onLeave(player: Player, stateMachine: PlayerStateMachine): void {
        player.stopAnimation("catch");
    }

    update(player: Player, stateMachine: PlayerStateMachine, input: Input): void {

    }

}