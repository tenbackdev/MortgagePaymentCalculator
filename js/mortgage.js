class Mortgage {
    constructor(principalDollars, interestRate, loanTerm, additionalPrincipal) {
        this.principalDollars = principalDollars ? principalDollars : 250000;
        this.interestRate = interestRate ? interestRate : 4.25;
        this.loanTerm = loanTerm ? loanTerm : 30;
        this.additionalPrincipal = additionalPrincipal ? additionalPrincipal : 0;
    }

    get loanTermMonths() {
        return this.loanTerm * 12;
    }

    get monthlyInterestRate() {
        return this.interestRate / 100 / 12;
    }

    toFixedNumber(nbr, digits) {
        const pow = Math.pow(10, digits);
        return Math.round(nbr * pow) / pow;
    }

    calculateMinimumPrincipalAndInterest() {
        const mnlyInterestRate = this.monthlyInterestRate;
        const nbrOfPayments = this.loanTermMonths;
        const minPaymentNumerator = this.principalDollars * mnlyInterestRate * Math.pow(1 + mnlyInterestRate, nbrOfPayments);
        const minPaymentDenominator = Math.pow(1 + mnlyInterestRate, nbrOfPayments) - 1;

        const minPayment = minPaymentNumerator / minPaymentDenominator;
        return this.toFixedNumber(minPayment,2);
    }

    calculateMortgageDetail() {
        let outstandingPrincipal = this.principalDollars;
        let minimumPrincipalAndInterest = this.calculateMinimumPrincipalAndInterest();
        let monthNumber = 0;
        let interestRunningTotal = 0;
        let curInterest, curPrincipal, curPrincipalInterest, curPrincipalTotal;
        let additionalPrincipal = this.additionalPrincipal;
        let amortArray = []

        while (outstandingPrincipal > 0) {
            monthNumber += 1
            curInterest = this.toFixedNumber((outstandingPrincipal * (this.monthlyInterestRate)), 2);
            curPrincipalTotal = curPrincipal + additionalPrincipal;

            if (outstandingPrincipal >= minimumPrincipalAndInterest) {
                curPrincipal = this.toFixedNumber((minimumPrincipalAndInterest - curInterest), 2);
                curPrincipalTotal = curPrincipal + additionalPrincipal;
                curPrincipalInterest = this.toFixedNumber(minimumPrincipalAndInterest, 2);
            } else {
                curPrincipal = this.toFixedNumber(outstandingPrincipal, 2);
                curPrincipalInterest = this.toFixedNumber(outstandingPrincipal + curInterest, 2);
                curPrincipalTotal = curPrincipalInterest;
            }

            interestRunningTotal += curInterest;
            outstandingPrincipal = this.toFixedNumber(outstandingPrincipal - curPrincipalTotal, 2);

            amortArray.push({'paymentNumber': monthNumber
                , 'principalInterest': curPrincipalInterest
                , 'principal': curPrincipal
                , 'interest': curInterest
                , 'principalOutstanding': this.toFixedNumber(outstandingPrincipal, 2)
                , 'additionalPrincipal': this.toFixedNumber(additionalPrincipal, 2) 
                , 'interestRunningTotal': this.toFixedNumber(interestRunningTotal, 2)});

            //Protection Against Infinite Loop
            if (monthNumber > 5000) {
                break;
            }
        }

        return amortArray;

    }

    toString() {
        return `Mortgage is for \$${this.principalDollars}, with a ${this.interestRate} interest rate and a term of ${this.loanTerm}.`
    }
}

//Know this should be exported as a module, but think there is something
//that is not set up with Node just yet. Will figure out in time.
//module.exports = Mortgage;