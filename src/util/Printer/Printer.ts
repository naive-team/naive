import { PrinterTag } from "./PrinterTag";

export class Printer {
    private static activeTags_: Record<PrinterTag, boolean> = {
        [PrinterTag.INPUT]: true
    };

    public static print(tag: PrinterTag, ...msg: any[]): void {
        if (! this.activeTags_[tag]) return;

        console.log(msg)
    }

    public static setActive(tag: PrinterTag, active: boolean): void {
        this.activeTags_[tag] = active;
    }
}