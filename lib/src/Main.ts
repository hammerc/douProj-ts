import { GameApp } from "./game/GameApp";

class Main {
    public constructor() {
        new dou2d.Engine(GameApp);
    }
}

new Main();
