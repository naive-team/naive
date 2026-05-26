import {EntityFamily} from "./EntityFamily";
import {Entity} from "../interfaces/Entity";
import {GameContext} from "../../util/GameContext";
import {Commandable} from "../interfaces/Commandable";
import {Color} from "../../Commands/Color";

export class EntityManager {
    private entities_: Entity[] = [];

    public add(entity: Entity) {
        this.entities_.push(entity);
    }

    public remove(entity: Entity) {
        this.entities_ = this.entities_.filter(e => e !== entity);
    }

    public getEntitiesByFamily(family: EntityFamily): Entity[] {
        return this.entities_.filter((e) => e.getFamily() === family);
    }


    public getEntityByFamily(family: EntityFamily): Entity {
        return this.entities_.find((e) => e.getFamily() === family);
    }

    public getCommandableByColor(color: Color): Commandable {
        const commandables: Commandable[] = this.getCommandables_();

        return commandables.find((c) => {return c.getColor() === color});
    }

    public updateAll(ctx: GameContext): void {
        for (const entity of this.entities_) {
            entity.update(ctx);
        }
    }

    private getCommandables_(): Commandable[] {
        return this.entities_.filter((e) => {return "execute" in e && "getColor" in e}) as Commandable[];
    }
}