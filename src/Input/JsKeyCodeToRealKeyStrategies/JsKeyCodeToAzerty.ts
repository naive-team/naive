import {JsKeyCodeToRealKeyStrategy} from "./JsKeyCodeToRealKeyStrategy";
import {JsKeyCode} from "../JsKeyCode";
import {TypableKey} from "../TypableKey";

export class JsKeyCodeToAzerty implements JsKeyCodeToRealKeyStrategy {
    private keyCodeToRealKey_: Record<TypableKey, string> = {
        KeyQ: "a",
        KeyW: "z",
        KeyE: "e",
        KeyR: "r",
        KeyT: "t",
        KeyY: "y",
        KeyU: "u",
        KeyI: "i",
        KeyO: "o",
        KeyP: "p",
        KeyA: "q",
        KeyS: "s",
        KeyD: "d",
        KeyF: "f",
        KeyG: "g",
        KeyH: "h",
        KeyJ: "j",
        KeyK: "k",
        KeyL: "l",
        Semicolon: "m",
        KeyZ: "w",
        KeyX: "x",
        KeyC: "c",
        KeyV: "v",
        KeyB: "b",
        KeyN: "n",
        KeyM: ""
    }

    convert(typableKey: TypableKey): string {
        const result: string = this.keyCodeToRealKey_[typableKey]
        return result;
    }
}