import {SceneStateMachine} from "../StateMachine/SceneStateMachine";
import {GameContext} from "../../../util/GameContext";

export interface SceneState {
    onEnter(state: SceneStateMachine, ctx: GameContext): void;
    update(stateMachine: SceneStateMachine, ctx: GameContext): void
}