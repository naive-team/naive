import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EntityManager} from "../../Entities/util/EntityManager";
import {Input} from "../../Input/Input";
import {EXIT_BUTTON} from "../../Input/Keys";
import {SceneStatePlaying} from "./SceneStatePlaying";

export class SceneStateUsingPC implements SceneState {

    update(stateMachine: SceneStateMachine, _entityManager: EntityManager, input: Input): void {
        input.update();

        if (input.getPressed(EXIT_BUTTON)) {
            stateMachine.changeState(new SceneStatePlaying());
        }
    }
}