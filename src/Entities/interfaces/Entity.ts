import {AbstractMesh} from "@babylonjs/core";
import {EntityFamily} from "../util/EntityFamily";

export interface Entity {
    update(): void;
    getFamily(): EntityFamily;
    getCollider(): AbstractMesh;
}