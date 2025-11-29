export class Printer {
    private static isActive_: boolean = true;

    public static print(...msg: any[]): void {
        if (! this.isActive_) return;

        console.log(msg)
    }

    public static setActive(active: boolean): void {
        this.isActive_ = active;
    }
}