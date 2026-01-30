export interface IVideoMesh {
    start(): boolean;
    waitUntilReady(): Promise<void>;
}