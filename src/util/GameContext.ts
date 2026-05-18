import {EntityManager} from "../Entities/util/EntityManager";
import {Input} from "../Input/Input";
import {Player} from "../Entities/Player";

export class GameContext {
    constructor(
        public readonly entityManager: EntityManager,
        public readonly input: Input,
        public readonly player: Player
    ) {}
}