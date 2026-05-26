import {Command} from "./Command";

export class CommandConverter {
    public static fromString(str: string): Command {
        switch (str) {
            case "move":
                return Command.MOVE;
            case "help":
                return Command.HELP;
            default:
                return null;
        }

    }
}