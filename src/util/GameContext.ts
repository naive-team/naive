import {EntityManager} from "../Entities/util/EntityManager";
import {Input} from "../Input/Input";
import {Player} from "../Entities/Player";
import {PlayerStateMachine} from "../States/PlayerStates/Animation/PlayerStateMachine";
import {PlayerCamera} from "./PlayerCamera";

export class GameContext {
    constructor(
        public readonly entityManager: EntityManager,
        public readonly input: Input,
        public readonly playerCamera: PlayerCamera,
        public readonly canvas: HTMLCanvasElement
    ) {}
}