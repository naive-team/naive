import {Entity} from "./Entity";
import {EntityManager} from "../util/EntityManager";

export interface Bug extends Entity {
    captured(entityManager: EntityManager): void;
}