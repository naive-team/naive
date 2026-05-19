import {JsKeyCodeToRealKeyStrategy} from "./JsKeyCodeToRealKeyStrategy";
import {JsKeyCode} from "../JsKeyCode";
import {TypableKey} from "../TypableKey";

export class JsKeyCodeToAzerty implements JsKeyCodeToRealKeyStrategy {
    private keyCodeToRealKey_: Record<TypableKey, string> = {
        Digit0: "0",
        Digit1: "1",
        Digit2: "2",
        Digit3: "3",
        Digit4: "4",
        Digit5: "5",
        Digit6: "6",
        Digit7: "7",
        Digit8: "8",
        Digit9: "9",
        Numpad0: "0",
        Numpad1: "1",
        Numpad2: "2",
        Numpad3: "3",
        Numpad4: "4",
        Numpad5: "5",
        Numpad6: "6",
        Numpad7: "7",
        Numpad8: "8",
        Numpad9: "9",
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