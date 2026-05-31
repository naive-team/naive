import {Color} from "./Color";

export class ColorConverter {
    public static fromString(str: string): Color {
        switch (str) {
            case "y":
            case "yellow":
                return Color.YELLOW;
            default:
                return null;
        }
    }
}