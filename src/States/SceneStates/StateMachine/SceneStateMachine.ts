import {SceneState} from "../interface/SceneState";
import {EntityManager} from "../../../Entities/util/EntityManager";
import {Input} from "../../../Input/Input";

export class SceneStateMachine {
    constructor(private currentState_: SceneState) {}

    changeState(newState_: SceneState): void {
        this.currentState_ = newState_;
    }

    update(entityManager: EntityManager, input: Input): void {
        this.currentState_.update(this, entityManager, input);
    }
}