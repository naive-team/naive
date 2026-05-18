import {SceneStateMachine} from "../StateMachine/SceneStateMachine";
import {Input} from "../../../Input/Input";
import {EntityManager} from "../../../Entities/util/EntityManager";
import {GameContext} from "../../../util/GameContext";

export interface SceneState {
    onEnter(state: SceneStateMachine, ctx: GameContext): void;
    update(stateMachine: SceneStateMachine, ctx: GameContext): void
}