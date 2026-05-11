import {Entity} from "./Entity";
import {EntityFamily} from "./EntityFamily";

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
}