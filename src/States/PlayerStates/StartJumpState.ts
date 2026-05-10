import {PlayerState} from "./PlayerState";
import {CharacterSupportedState, CharacterSurfaceInfo, PhysicsCharacterController, Vector3} from "@babylonjs/core";
import {InAirState} from "./InAirState";
import {PlayerPhysics} from "../../PlayerPhysics";

export class StartJumpState extends PlayerState {
    public getNextState(_support: CharacterSupportedState, _playerPhysics: PlayerPhysics): PlayerState {
        return new InAirState();
    }

    public override getDesiredVelocity(characterController: PhysicsCharacterController, playerPhysics: PlayerPhysics, _deltaTime: number, _supportInfo: CharacterSurfaceInfo): Vector3 {
        let upWorld: Vector3 = playerPhysics.characterGravity.normalizeToNew();
        upWorld.scaleInPlace(-1.0);
        let u: number = Math.sqrt(2 * playerPhysics.characterGravity.length() * playerPhysics.jumpHeight);
        let curRelVel: number = characterController.getVelocity().dot(upWorld);
        return characterController.getVelocity().add(upWorld.scale(u - curRelVel));
    }
}