import {AbstractMesh} from "@babylonjs/core";
import {EntityFamily} from "../util/EntityFamily";
import {GameContext} from "../../util/GameContext";

export interface Entity {
    update(ctx: GameContext): void;
    getFamily(): EntityFamily;
    getCollider(): AbstractMesh;
    getId(): string;
}