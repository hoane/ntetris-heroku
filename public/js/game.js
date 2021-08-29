var config = {
    type: Phaser.AUTO,
    parent: 'game-canvas',
    width: 450,
    height: 1000,
    backgroundColor: '#7788aa',
    scene: [
        MainMenuScene,
        GameRoomScene
    ],
    physics: {
        default: "arcade"
    }
};

var game = new Phaser.Game(config);