class MainMenuScene extends Phaser.Scene {
    constructor(config) {
        super({
            ...config,
            key: 'main-menu-scene'
        });
    }

    font = { fontSize: '24px', fontFamily: 'FreeMono, monospace' };
    roomCode = "";

    init(data) {
        this.message = data.message || '';
    }

    preload() {
		this.load.image('glass-panel', 'assets/glassPanel.png');
		this.load.image('cursor-hand', 'assets/cursor_hand.png');
    }

    create(_data) {
        this.cameras.main.backgroundColor = '#4477BB';
        let self = this;
        let { width, height } = this.scale;

        this.add.text(width * 0.5, height * 0.1, this.message, this.font).setOrigin(0.5);
        this.add.text(width * 0.5, height * 0.2, 'ntetris', this.font).setOrigin(0.5);

        let hostButton = this.add.image(width * 0.5, height * 0.4, 'glass-panel')
            .setDisplaySize(150, 50);
        this.add.text(hostButton.x, hostButton.y, 'Create', this.font).setOrigin(0.5);
        hostButton.setInteractive();
        hostButton.on('pointerdown', function () {
            self.scene.start('game-room-scene', {
                'createRoom': 'true'
            });
        });

        let joinButton = this.add.image(width * 0.5, height * 0.5, 'glass-panel')
            .setDisplaySize(150, 50);
        this.add.text(joinButton.x, joinButton.y, 'Join', this.font).setOrigin(0.5);
        joinButton.setInteractive();
        joinButton.on('pointerdown', function () {
            if (self.roomCode.length === 2) {
                self.scene.start('game-room-scene', {
                    'createRoom': 'false',
                    'roomCode': self.roomCode
                });
            }
        });

        this.roomCodeText = this.add.text(width * 0.75, joinButton.y, '', this.font);
        this.roomCodeText.setOrigin(0.5);

        let baseX = width * 0.5;
        let baseY = height * 0.6;
        for (let i = 1; i <= 9; i++) {
            let r = 2 - Math.floor((i - 1) / 3);
            let c = (i - 1) % 3 - 1;
            let x = baseX + c * 50;
            let y = baseY + r * 50;
            this.createNumButton(i.toString(), x, y)
        }
        this.createNumButton('0', baseX, baseY + 3 * 50);
        this.createNumButton('C', baseX + 50, baseY + 3 * 50);
    }

    createNumButton(n, x, y) {
        let numButton = this.add.image(x, y, 'glass-panel').setDisplaySize(50, 50);
        this.add.text(numButton.x, numButton.y, n, this.font).setOrigin(0.5);
        numButton.setInteractive();
        let self = this;
        numButton.on('pointerdown', function () {
            if (n === 'C') {
                self.roomCode = "";
            } else {
                if (self.roomCode.length < 4) {
                    self.roomCode += n;
                }
            }
            console.log(self.roomCode);
        });
    }

    update(_time, _delta) {
        this.roomCodeText.setText(this.roomCode);
    }

}