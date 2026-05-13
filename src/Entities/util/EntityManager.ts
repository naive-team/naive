import {EntityFamily} from "./EntityFamily";
import {Entity} from "../interfaces/Entity";

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

    public updateAll(): void {
        for (const entity of this.entities_) {
            entity.update();
        }
    }
}