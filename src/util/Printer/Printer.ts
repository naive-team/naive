import { PrinterTag } from "./PrinterTag";

export class Printer {
    // Mettre à jour cet attribut pour filtrer les tags
    private static activeTags_: Record<PrinterTag, boolean> = {
        [PrinterTag.INPUT]: false,
        [PrinterTag.VIDEO]: true
    };

    public static print(tag: PrinterTag, ...msg: any[]): void {
        if (! this.activeTags_[tag]) return;

        console.log(msg)
    }

    public static setActive(tag: PrinterTag, active: boolean): void {
        this.activeTags_[tag] = active;
    }
}