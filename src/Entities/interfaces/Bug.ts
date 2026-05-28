import {Entity} from "./Entity";
import {EntityManager} from "../util/EntityManager";
import {BugCounter} from "../../UI/BugCounter";

export interface Bug extends Entity {
    captured(entityManager: EntityManager, bugCounterUi:BugCounter): void;
}