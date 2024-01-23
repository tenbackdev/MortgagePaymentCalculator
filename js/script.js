console.log("hello world!")


class Mortgage {
    constructor(interestRateBps, startDate, principalCents) {
        this.interestRateBps = interestRateBps;
        this.startDate = startDate;
        this.principalCents = principalCents;
    }

    toString() {
        return `Mortgage is for \$${this.principalCents / 100}, with a ${this.interestRateBps / 100}% interest rate, starting ${this.startDate}.`
    }
}

const myMortgage = new Mortgage(275, '2024-01-22', '25200000');

console.log(myMortgage.toString());










