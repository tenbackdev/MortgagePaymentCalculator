class Mortgage {
    constructor(interestRate, startDate, principal) {
        this.interestRateBps = interestRate * 100;
        this.startDate = startDate;
        this.principalCents = principal * 100; //Is there a way to DRY this up?
    }    

    getPrincipalAndInterest() {
        let interestMonthly = (this.interestRateBps / (12 * 10000));
        let loanTerm = 360;
        let interestCalc = (1.0 + interestMonthly) ** loanTerm;
        console.log(`IM: ${interestMonthly}, LT: ${loanTerm}, IC: ${interestCalc}`)
        return Math.round((this.principalCents * interestMonthly * interestCalc / (interestCalc - 1)), 0) / 100;
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

const myMortgage = new Mortgage(3.25, '2024-01-22', '260000.00');
console.log(myMortgage.getPrincipalAndInterest());

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










