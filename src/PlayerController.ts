import {InputManager} from "./Input/InputManager";
import {PlayerState} from "./States/PlayerStates/PlayerState";
import {PlayerPhysics} from "./PlayerPhysics";
import {PhysicsCharacterController} from "@babylonjs/core";

export class PlayerController {

    private inputManager_: InputManager
    private playerState_: PlayerState;
    private playerPhysics_: PlayerPhysics;
    private characterController: PhysicsCharacterController

    constructor() {

    }
}