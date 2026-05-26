import {Entity} from "./Entity";
import {Command} from "../../Commands/Command";
import {GameContext} from "../../util/GameContext";
import {Color} from "../../Commands/Color";

export interface Commandable extends Entity {
    execute(ctx: GameContext, command: Command, args: string[]): string;
    getColor(): Color;
}