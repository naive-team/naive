import {Quaternion, Vector3} from "@babylonjs/core";

export class PlayerPhysics {
    public inAirSpeed: number = 8.0;
    public onGroundSpeed: number = 10.0;
    public jumpHeight: number = 1.5;
    public wantJump: boolean = false;
    public inputDirection: Vector3 = new Vector3(0,0,0);
    public forwardLocalSpace: Vector3 = new Vector3(0, 0, 1);
    public characterOrientation: Quaternion = Quaternion.Identity();
    public characterGravity: Vector3 = new Vector3(0, -18, 0);
}