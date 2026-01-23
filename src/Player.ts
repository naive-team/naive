import {Mesh, TransformNode} from "@babylonjs/core";

export class Player extends TransformNode {
    private mesh: Mesh;

    public constructor(mesh: Mesh) {
        super("Player");
        this.mesh = mesh;
        this.mesh.setParent(this);

    }
}