import {Entity} from "./Entity";
import {Command} from "../../Commands/Command";
import {GameContext} from "../../util/GameContext";
import {Color} from "../../Commands/Color";
import {Firefly} from "../Firefly";
import {EntityManager} from "../util/EntityManager";
import {AbstractMesh} from "@babylonjs/core";

export interface Commandable extends Entity {
    execute(ctx: GameContext, command: Command, args: string[]): string;
    getColor(): Color;
    attachFirefly(firefly: Firefly, entityManager: EntityManager): void;
    getProximityZone(): AbstractMesh;
    uncolor(): void;
}