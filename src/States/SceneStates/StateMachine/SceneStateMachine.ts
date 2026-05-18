import {SceneState} from "../interface/SceneState";
import {EntityManager} from "../../../Entities/util/EntityManager";
import {Input} from "../../../Input/Input";
import {GameContext} from "../../../util/GameContext";

export class SceneStateMachine {
    constructor(private currentState_: SceneState) {}

    changeState(newState: SceneState, ctx: GameContext): void {
        this.currentState_ = newState;
        this.currentState_.onEnter(this, ctx);
    }

    update(ctx: GameContext): void {
        this.currentState_.update(this, ctx);
    }
}