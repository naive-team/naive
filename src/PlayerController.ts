import {InputManager} from "./Input/InputManager";
import {PlayerState} from "./States/PlayerStates/PlayerState";
import {PlayerPhysics} from "./PlayerPhysics";
import {
    Camera,
    FreeCamera,
    KeyboardEventTypes,
    MeshBuilder,
    PhysicsCharacterController,
    Quaternion,
    Vector3
} from "@babylonjs/core";
import {BabylonManager} from "./util/BabylonManager";
import {InAirState} from "./States/PlayerStates/InAirState";

export class PlayerController {

    private inputManager_: InputManager
    private playerState_: PlayerState;
    private playerPhysics_: PlayerPhysics;
    private readonly characterController_: PhysicsCharacterController
    private camera_: FreeCamera;

    constructor() {
        //this.inputManager_.getCurrentInput()
        let babylonManager = BabylonManager.instance;
        let scene = babylonManager.engine.scenes[0];
        this.camera_ = new FreeCamera("camera1", new Vector3(0, 5, -5), scene);
        this.camera_.attachControl(babylonManager.canvas);
        this.playerPhysics_ = new PlayerPhysics();
        this.playerState_ = new InAirState();

        let h = 1.8;
        let r = 0.6;
        let displayCapsule = MeshBuilder.CreateCapsule("CharacterDisplay", {height: h, radius: r}, scene);
        let characterPosition = new Vector3(3., 0.3, -8.);
        this.characterController_ = new PhysicsCharacterController(characterPosition, {capsuleHeight: h, capsuleRadius: r}, scene);
        this.camera_.setTarget(characterPosition);

        scene.onBeforeRenderObservable.add(() => {
            displayCapsule.position.copyFrom(this.characterController_.getPosition());

            // camera following
            var cameraDirection = this.camera_.getDirection(new Vector3(0,0,1));
            cameraDirection.y = 0;
            cameraDirection.normalize();
            this.camera_.setTarget(Vector3.Lerp(this.camera_.getTarget(), displayCapsule.position, 0.1));
            var dist = Vector3.Distance(this.camera_.position, displayCapsule.position);
            const amount = (Math.min(dist - 6, 0) + Math.max(dist - 9, 0)) * 0.04;
            cameraDirection.scaleAndAddToRef(amount, this.camera_.position);
            this.camera_.position.y += (displayCapsule.position.y + 2 - this.camera_.position.y) * 0.04;
        });

        scene.onAfterPhysicsObservable.add((_) => {
            if (scene.deltaTime == undefined) return;
            let dt = scene.deltaTime / 1000.0;
            if (dt == 0) return;

            let down = new Vector3(0, -1, 0);
            let support = this.characterController_.checkSupport(dt, down);

            Quaternion.FromEulerAnglesToRef(0, this.camera_.rotation.y, 0, this.playerPhysics_.characterOrientation);
            let desiredLinearVelocity = this.playerState_.getDesiredVelocity(this.characterController_, this.playerPhysics_, dt, support);
            this.characterController_.setVelocity(desiredLinearVelocity);

            this.characterController_.integrate(dt, support, this.playerPhysics_.characterGravity);
        });

        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
                case KeyboardEventTypes.KEYDOWN:
                    if (kbInfo.event.key == 'w' || kbInfo.event.key == 'ArrowUp') {
                        this.playerPhysics_.inputDirection.z = 1;
                    } else if (kbInfo.event.key == 's' || kbInfo.event.key == 'ArrowDown') {
                        this.playerPhysics_.inputDirection.z = -1;
                    } else if (kbInfo.event.key == 'a' || kbInfo.event.key == 'ArrowLeft') {
                        this.playerPhysics_.inputDirection.x = -1;
                    } else if (kbInfo.event.key == 'd' || kbInfo.event.key == 'ArrowRight') {
                        this.playerPhysics_.inputDirection.x = 1;
                    } else if (kbInfo.event.key == ' ') {
                        this.playerPhysics_.wantJump = true;
                    }
                    break;
                case KeyboardEventTypes.KEYUP:
                    if (kbInfo.event.key == 'w' || kbInfo.event.key == 's' || kbInfo.event.key == 'ArrowUp' || kbInfo.event.key == 'ArrowDown') {
                        this.playerPhysics_.inputDirection.z = 0;
                    }
                    if (kbInfo.event.key == 'a' || kbInfo.event.key == 'd' || kbInfo.event.key == 'ArrowLeft' || kbInfo.event.key == 'ArrowRight') {
                        this.playerPhysics_.inputDirection.x = 0;
                    } else if (kbInfo.event.key == ' ') {
                        this.playerPhysics_.wantJump = false;
                    }
                    break;
            }
        });
    }
}