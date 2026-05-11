import {Mesh, TransformNode} from "@babylonjs/core";
import {PlayerController} from "./PlayerController";

export class PlayerWithPhysics {

    private _mesh_: Mesh;
    private playerController_: PlayerController;

    public constructor() {
        //super("Player");
        //this._mesh_ = mesh;
        //this._mesh_.setParent(this);
        this.playerController_ = new PlayerController();
    }

    get mesh_(): Mesh {
        return this._mesh_;
    }

    set mesh_(value: Mesh) {
        this._mesh_ = value;
    }
}