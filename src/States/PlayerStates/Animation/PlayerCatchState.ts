import {PlayerAnimationState} from "./PlayerAnimationState";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {ITimerOptions, Mesh, Scene, setAndStartTimer} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {EntityManager} from "../../../Entities/util/EntityManager";
import {EntityFamily} from "../../../Entities/util/EntityFamily";
import {Bug} from "../../../Entities/util/Bug";
import {Entity} from "../../../Entities/util/Entity";

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

    update(_player: Player, _stateMachine: PlayerStateMachine, _input: Input, _entityManager: EntityManager): void {
        const netCollider: Mesh = _player.getNetCollider();

        const candidates: Entity[] = _entityManager.getEntitiesByFamily(EntityFamily.BUG);

        for (const candidate of candidates) {
            if (netCollider.intersectsMesh(candidate.getCollider())) {
                (candidate as Bug).captured();
            }
        }
    }

}