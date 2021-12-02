const Color = Phaser.Display.Color;

export default class Button {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;

        this.text = this.scene.add.text(this.config.x, this.config.y, this.config.text, this.config.style)
        this.text.setOrigin(0.5);

        this.border = this.scene.add.rectangle(this.config.x, this.config.y, this.config.width, this.config.height, 0x000, 0);
        this.border.setStrokeStyle(3, Color.HexStringToColor(this.config.style.color)._color, 1);
        this.border.setDepth(this.text.depth + 1);
        this.border.setInteractive({ useHandCursor: true });

        this.border.on('pointerdown', () => { this.onPressed() });
    }

    setVisible(flag) {
        this.text.setVisible(flag);
        this.border.setVisible(flag);
    }

    onPressed() {
        if (this.config.onClickEvent) {
            this.config.onClickEvent();
        }
    }
}