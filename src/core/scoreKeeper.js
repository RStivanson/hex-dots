export default class ScoreKeeper {
    constructor(scorePerDot, loopMultiplier, flowerMultiplier) {
        this.scorePerDot = scorePerDot;
        this.loopMultiplier = loopMultiplier;
        this.flowerMultiplier = flowerMultiplier;
        this.reset();
    }

    addScore(dotList, isLoop, isFlower) {
        let delta = this.calculateScore(dotList, isLoop, isFlower);
        this.score += delta;
    }

    reset() {
        this.score = 0;
    }

    calculateScore(dotList, isLoop, isFlower) {
        if (!dotList || dotList.length == 0)
            return 0;

        let multiplier = 1;
        if (isFlower) {
            multiplier = this.flowerMultiplier;
        } else if (isLoop) {
            multiplier = this.loopMultiplier;
        }
        return dotList.length * this.scorePerDot * multiplier;
    }
}