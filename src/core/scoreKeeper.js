export default class ScoreKeeper {
    constructor(scorePerDot, loopMultiplier) {
        this.scorePerDot = scorePerDot;
        this.loopMultiplier = loopMultiplier;
        this.reset();
    }

    addScore(dotList, isLoop) {
        let delta = this.calculateScore(dotList, isLoop);
        this.score += delta;
    }

    reset() {
        this.score = 0;
    }

    calculateScore(dotList, isLoop) {
        if (!dotList || dotList.length == 0)
            return 0;

        let loopMultiplier = isLoop ? this.loopMultiplier : 1;
        return dotList.length * this.scorePerDot * loopMultiplier;
    }
}