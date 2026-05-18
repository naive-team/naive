import {SceneState} from "./interface/SceneState";
import {SceneStateMachine} from "./StateMachine/SceneStateMachine";
import {EXIT_BUTTON} from "../../Input/Keys";
import {SceneStatePlaying} from "./SceneStatePlaying";
import {Entity} from "../../Entities/interfaces/Entity";
import {EntityFamily} from "../../Entities/util/EntityFamily";
import {GameContext} from "../../util/GameContext";
import {PC} from "../../Entities/PC";

export class SceneStateUsingPC implements SceneState {
    private pc_: PC;


    update(stateMachine: SceneStateMachine, ctx: GameContext): void {
        ctx.input.update();
        this.pc_.update(ctx);

        if (ctx.input.getPressed(EXIT_BUTTON)) {
            stateMachine.changeState(new SceneStatePlaying(), ctx);
        }
    }

    onEnter(_stateMachine: SceneStateMachine, ctx: GameContext): void {
        this.pc_ = ctx.entityManager.getEntityByFamily(EntityFamily.PC) as PC;
        this.pc_.turnOn();
    }

    onLeave(_state: SceneStateMachine, _ctx: GameContext): void {
        this.pc_.turnOff();
    }
}