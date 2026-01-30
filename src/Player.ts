import {Mesh, TransformNode} from "@babylonjs/core";

export class Player extends TransformNode {
    private mesh_: Mesh;

    public constructor(mesh: Mesh) {
        super("Player");
        this.mesh_ = mesh;
        this.mesh_.setParent(this);

    }
}