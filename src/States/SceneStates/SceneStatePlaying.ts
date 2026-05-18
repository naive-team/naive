import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {Input} from "../../Input/Input";
import {EntityManager} from "../../Entities/util/EntityManager";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {Player} from "../../Entities/Player";
import {DIALOG_BUTTON} from "../../Input/Keys";
import {SceneStateUsingPC} from "./SceneStateUsingPC";


export class SceneStatePlaying implements SceneState {
    update(stateMachine: SceneStateMachine, entityManager: EntityManager, input: Input): void {
        entityManager.updateAll();
        input.update();

        this.checkPCActivation_(entityManager, input, stateMachine);
    }

    private checkPCActivation_(entityManager: EntityManager, input: Input, stateMachine: SceneStateMachine): void {
        const player: Player = entityManager.getEntityByFamily(EntityFamily.PLAYER) as Player;

        if (player.isNearPC(entityManager) && input.getPressed(DIALOG_BUTTON)) {
            stateMachine.changeState(new SceneStateUsingPC());
        }
    }

    onEnter(_stateMachine: SceneStateMachine, _entityManager: EntityManager, _input: Input): void {
    }
}