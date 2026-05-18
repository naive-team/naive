import {SceneState} from "../interface/SceneState";
import {GameContext} from "../../../util/GameContext";

export class SceneStateMachine {
    constructor(private currentState_: SceneState) {}

    changeState(newState: SceneState, ctx: GameContext): void {
        this.currentState_.onLeave(this, ctx);
        this.currentState_ = newState;
        this.currentState_.onEnter(this, ctx);
    }

    update(ctx: GameContext): void {
        this.currentState_.update(this, ctx);
    }
}