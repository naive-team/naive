import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EXIT_BUTTON} from "../../Input/Keys";
import {SceneStatePlaying} from "./SceneStatePlaying";
import {Entity} from "../../Entities/interfaces/Entity";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {GameContext} from "../../util/GameContext";

export class SceneStateUsingPC implements SceneState {
    private pc_: Entity;


    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.input.update();

        this.pc_.update();

        if (ctx.input.getPressed(EXIT_BUTTON)) {
            stateMachine.changeState(new SceneStatePlaying(), ctx);
        }
    }

    onEnter(_stateMachine: SceneStateMachine, ctx: GameContext): void {
        this.pc_ = ctx.entityManager.getEntityByFamily(EntityFamily.PC);
    }
}