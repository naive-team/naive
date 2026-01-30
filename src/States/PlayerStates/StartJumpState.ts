import {PlayerState} from "./PlayerState";
import {CharacterSupportedState, Vector3} from "@babylonjs/core";
import {InAirState} from "./InAirState";

export class StartJumpState extends PlayerState {
    getNextState(_support: CharacterSupportedState, _wantToJump: boolean): PlayerState {
        return new InAirState();
    }

    public getDesiredVelocity(): Vector3 {
        throw new Error("Method not implemented.");
    }
}