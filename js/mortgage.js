class Mortgage {
    constructor(principalDollars, interestRate, loanTerm) {
        this.principalDollars = principalDollars;
        this.interestRate = interestRate;
        this.loanTerm = loanTerm;
    }

    get loanTermMonths() {
        return this.loanTerm * 12;
    }

    get monthlyInterestRate() {
        return this.interestRate / 100 / 12;
    }

    toString() {
        return `Mortgage is for \$${this.principalDollars}, with a ${this.interestRate} interest rate and a term of ${this.loanTerm}.`
    }
}

//Know this should be exported as a module, but think there is something
//that is not set up with Node just yet. Will figure out in time.
//module.exports = Mortgage;