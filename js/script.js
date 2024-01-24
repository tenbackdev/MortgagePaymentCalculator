class Mortgage {
    constructor(interestRateBps, startDate, principalCents) {
        this.interestRateBps = interestRateBps;
        this.startDate = startDate;
        this.principalCents = principalCents;
    }

    setPrincipal(principal) {
        //Saving this in cents to avoid decimals in JS logic
        this.principalCents = principalDollars * 100;
    }

    getPrincipal() {
        return this.principalCents / 100;
    }

    setInterestRate(interestRate) {
        //Saving this in BPS to avoid decimals in JS logic
        this.interestRateBps = interestRate * 100;
    }

    getInterestRate() {
        return this.interestRateBps / 100;
    }

    toString() {
        return `Mortgage is for \$${this.principalCents / 100}, with a ${this.interestRateBps / 100}% interest rate, starting ${this.startDate}.`
    }
}

const myMortgage = new Mortgage(275, '2024-01-22', '25200023');

const startDateField = document.getElementById("startDateInput");
const intertestRateField = document.getElementById("interestRateInput");

intertestRateField.addEventListener('change', changeInterestRate)

function changeInterestRate() {
    myMortgage.setInterestRate(intertestRateField.value)
    console.log(myMortgage.toString());
}

console.log(myMortgage.getInterestRate())
console.log(myMortgage.getPrincipal())



//console.log(startDateField);
//intertestRateField.value = 1.25



console.log(myMortgage.toString());










