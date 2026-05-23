import {Entity} from "./Entity";

export interface Bug extends Entity {
    captured(): void;
}