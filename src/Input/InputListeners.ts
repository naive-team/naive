import {DualShockPad, GenericPad, Xbox360Pad} from "@babylonjs/core"
import { Button } from "./Button";
import { Printer } from "../util/Printer/Printer";
import { PrinterTag } from "../util/Printer/PrinterTag";

export class InputListeners {
    static stopListeningGamepad(gamepad: GenericPad | Xbox360Pad | DualShockPad)  {
        gamepad.onButtonUpObservable.clear();
        gamepad.onButtonUpObservable.clear();
        gamepad.onleftstickchanged(() => {})
        gamepad.onrightstickchanged(() => {});
    }

    static startListeningGamepad(gamepad: GenericPad | Xbox360Pad | DualShockPad,
        mapper: (n: number) => Button,
        inputMap: Record<Button, boolean>,
        onleftstickchangedAction: (values: any) => void,
        onrightstickchangedAction: (values: any) => void
    ): void
    {
        Printer.print(PrinterTag.INPUT, "In start listening gamepad");

        gamepad.onButtonDownObservable.add((n) => {
            const button: Button = mapper(n);
            inputMap[button] = true;

            Printer.print(PrinterTag.INPUT, `Button ${button} pressed`);
        });
                
        gamepad.onButtonUpObservable.add((n) => {
            const button: Button = mapper(n);
            inputMap[button] = false;

            Printer.print(PrinterTag.INPUT, `Button ${button} released`);
        });
                
        gamepad.onleftstickchanged(onleftstickchangedAction);
        gamepad.onrightstickchanged(onrightstickchangedAction);

        Printer.print(PrinterTag.INPUT, "Gamepad is ready");
    }
}

