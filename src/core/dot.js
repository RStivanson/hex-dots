import Phaser from 'phaser'
const Color = Phaser.Display.Color;

export const DotColors = [
    { id: 'red', color: Color.HexStringToColor('#bd2031') },
    { id: 'green', color: Color.HexStringToColor('#298129') },
    { id: 'blue', color: Color.HexStringToColor('#004999') },
    { id: 'purple', color: Color.HexStringToColor('#421c52') },
    { id: 'brown', color: Color.HexStringToColor('#82633a') },
    { id: 'pink', color: Color.HexStringToColor('#E85381') },
    { id: 'gold', color: Color.HexStringToColor('#D8B807') },
    { id: 'orange', color: Color.HexStringToColor('#be5504') },
];

export default class Dot extends Phaser.GameObjects.Image {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'dot');

        scene.add.existing(this);
        this.visible = false;
 
        this.scale = scale;
        this.setScale(this.scale);
        this.tweenTime = 0;

        let interaction = new Phaser.Geom.Circle(64, 64, 70);
        this.setInteractive(interaction, Phaser.Geom.Circle.Contains);
    }

    update() {
        this.updateTween();
    }

    setGridPos(row, col) {
        this.row = row;
        this.column = col;
    }

    setColorByIndex(idx) {
        this.colorData = DotColors[idx];
        this.refreshTint();
    }

    getEffectiveTint() {
        let color = this.colorData.color;
        let tintColor = new Phaser.Display.Color(color.red, color.green, color.blue, color.alpha);
        if (this.selected || this.lightenedTint || this.isFlowered)
            tintColor.lighten(15);
        return tintColor;
    }

    refreshTint() {
        this.setTint(this.getEffectiveTint()._color);
    }

    setLightenedTint(flag) {
        this.lightenedTint = flag;
        this.refreshTint();
    }

    setIsFlowered(flag) {
        this.isFlowered = flag;
        this.refreshTint();
    }

    select() {
        this.selected = true;
        this.refreshTint();
    }

    unselect() {
        this.selected = false;
        this.refreshTint();
    }

    enable() {
        this.visible = true;
        this.scene.tweens.add({
            targets: this,
            scaleX: { from: 0, to: this.scale },
            scaleY: { from: 0, to: this.scale },
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 400,
        });
    }

    disable(explodeEffect = false) {
        this.visible = false;
        this.scene.tweens.add({
            targets: this,
            scaleX: { from: this.scale, to: 0 },
            scaleY: { from: this.scale, to: 0 },
            ease: Phaser.Math.Easing.Cubic.Out,
            duration: 200,
        })
        .setCallback('onComplete', () => {
          this.destroy();
        }, []);
        if (explodeEffect)
            this.scene.createExplodeEffectAt(this.x, this.y, this.colorData.color._color);
    }

    tweenAlongPath(path) {
        this.path = path;
        this.scene.tweens.add({
          targets: this,
          tweenTime: { from: 0, to: 1 },
          ease: Phaser.Math.Easing.Bounce.Out,
          duration: 700
        })
        .setCallback('onComplete', () => {
          this.tweenTime = -1;
        }, []);
    }

    updateTween() {
        if (!this.path || this.tweenTime <= 0)
            return;

        let tweenPosition = new Phaser.Math.Vector2();
        this.path.getPoint(this.tweenTime, tweenPosition);
        this.setPosition(tweenPosition.x, tweenPosition.y);
    }
}

