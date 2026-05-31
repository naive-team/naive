import {PlayerAnimationState} from "./PlayerAnimationState";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {ITimerOptions, Mesh, Scene, setAndStartTimer} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {EntityManager} from "../../../Entities/util/EntityManager";
import {EntityFamily} from "../../../Entities/util/EntityFamily";
import {Entity} from "../../../Entities/interfaces/Entity";
import {Bug} from "../../../Entities/interfaces/Bug";
import {Firefly} from "../../../Entities/Firefly";
import {BugCounter} from "../../../UI/BugCounter";
import {Fireflycounter} from "../../../UI/Fireflycounter";
import {BugCounterFabric} from "../../../util/bugCounterFabric";

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

    update(player: Player, _stateMachine: PlayerStateMachine, _input: Input, entityManager: EntityManager): void {
        const netCollider: Mesh = player.getNetCollider();

        const candidates: Bug[] = entityManager.getEntitiesByFamily(EntityFamily.BUG) as Bug[];

        for (const candidate of candidates) {
            if (netCollider.intersectsMesh(candidate.getCollider())) {
                let bugcounter:BugCounter;
                if (candidate instanceof Firefly) {
                    bugcounter = BugCounterFabric.getFireflyCounter();
                }
                else{
                    bugcounter = BugCounterFabric.getBugCounter();
                }
                    candidate.captured(entityManager, bugcounter);
            }
        }
    }

}