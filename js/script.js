class Mortgage {
    constructor(interestRate, startDate, principal) {
        this.interestRateBps = interestRate * 100;
        this.startDate = startDate;
        this.principalCents = principal * 100; //Is there a way to DRY this up?
    }    

    setPrincipal(principal) {
        //Saving this in cents to avoid decimals in JS logic
        this.principalCents = principal * 100;
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
        return `Mortgage is for \$${this.getPrincipal()}, with a ${this.getInterestRate()}% interest rate, starting ${this.startDate}.`
    }
}

const myMortgage = new Mortgage(2.75, '2024-01-22', '252000.23');

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










