import {EntityFamily} from "./EntityFamily";
import {AbstractMesh} from "@babylonjs/core";

export interface Entity {
    update(): void;
    getFamily(): EntityFamily;
    getCollider(): AbstractMesh;
}