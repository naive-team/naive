import {JsKeyCode} from "../JsKeyCode";
import {TypableKey} from "../TypableKey";

export interface JsKeyCodeToRealKeyStrategy {
    convert(typableKey: TypableKey): string;
}
