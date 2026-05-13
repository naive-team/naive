import {SceneStateMachine} from "../StateMachine/SceneStateMachine";
import {Input} from "../../../Input/Input";
import {EntityManager} from "../../../Entities/util/EntityManager";

export interface SceneState {
    update(stateMachine: SceneStateMachine, entityManager: EntityManager, input: Input): void
}