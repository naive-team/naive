import {PlayerState} from "./PlayerState";
import {CharacterSupportedState, Vector3} from "@babylonjs/core";
import {InAirState} from "./InAirState";
import {StartJumpState} from "./StartJumpState";

export class OnGroundState extends PlayerState {

    getNextState(support: CharacterSupportedState, wantToJump: boolean): PlayerState {
        if (support != CharacterSupportedState.SUPPORTED) {
            return new InAirState();
        }
        if (wantToJump) {
            return new StartJumpState();
        }
        return this;
    }

    public getDesiredVelocity(): Vector3 {
        throw new Error("Method not implemented.");
    }
}