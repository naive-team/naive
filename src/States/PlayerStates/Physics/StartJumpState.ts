import {CharacterSupportedState, CharacterSurfaceInfo, PhysicsCharacterController, Vector3} from "@babylonjs/core";
import {InAirState} from "./InAirState";
import {PlayerPhysicsState} from "./PlayerPhysicsState";
import {PlayerPhysics} from "../../../PlayerPhysics";

export class StartJumpState extends PlayerPhysicsState {
    public getNextState(_support: CharacterSupportedState, _playerPhysics: PlayerPhysics): PlayerPhysicsState {
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