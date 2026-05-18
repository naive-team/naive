import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EntityManager} from "../../Entities/util/EntityManager";
import {Input} from "../../Input/Input";
import {EXIT_BUTTON} from "../../Input/Keys";
import {SceneStatePlaying} from "./SceneStatePlaying";
import {Entity} from "../../Entities/interfaces/Entity";
import {EntityFamily} from "../../Entities/util/EntityFamily";

export class SceneStateUsingPC implements SceneState {
    private pc_: Entity;


    update(stateMachine: SceneStateMachine, _entityManager: EntityManager, input: Input): void {
        input.update();

        this.pc_.update();

        if (input.getPressed(EXIT_BUTTON)) {
            stateMachine.changeState(new SceneStatePlaying());
        }
    }

    onEnter(_stateMachine: SceneStateMachine, entityManager: EntityManager, _input: Input): void {
        this.pc_ = entityManager.getEntityByFamily(EntityFamily.PC);
    }
}