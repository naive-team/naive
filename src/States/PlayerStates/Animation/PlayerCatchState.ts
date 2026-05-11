import {PlayerAnimationState} from "./PlayerAnimationState";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {ITimerOptions, setAndStartTimer, Scene, Mesh, AbstractMesh, Tools} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";

export class PlayerCatchState implements PlayerAnimationState {


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

    onLeave(player: Player, _stateMachine: PlayerStateMachine): void {
        player.stopAnimation("catch");
    }

    update(_player: Player, _stateMachine: PlayerStateMachine, _input: Input): void {
        const netCollider: Mesh = _player.getNetCollider();

        const candidates: AbstractMesh[] = []; // TODO
        let collideBug: boolean = false;

        for (const candidate of candidates) {
            if (netCollider.intersectsMesh(candidate)) {
                collideBug = true;
            }
        }
    }

}