export class GameApp extends dou2d.DisplayObjectContainer {
    public constructor() {
        super();
        this.on(dou2d.Event2D.ADDED_TO_STAGE, this.onAddedToStage, this);
    }

    private onAddedToStage(event: dou2d.Event2D): void {
        console.log("hello world!");
    }
}
