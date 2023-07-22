/*
Main header

4 hours

Ideas:
- Pinball moving upwards, hit with paddles around the map
- Parachuting downwards avoiding obstacles (parachute, balloons, flower)
- Platformer runner
- Combat focused runner
- Grid-based electrical circuit runner/maze endless runner
- Horde endless runner
- Conveyor belts
- Swinging
- Mapping keyboard keys to physical locations on map (running along keyboard)
- Relay races
- Going down slopes
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    fps: {
        forceSetTimeOut: true,
        target: 30
    }
    
}

let game = new Phaser.Game(config);

let keySPACE;