class Mortgage {
    constructor(interestRate, startDate, principal) {
        this.interestRateBps = interestRate * 100;
        this.startDate = startDate;
        this.principalCents = principal * 100; //Is there a way to DRY this up?
        this.termMonths = 360; //How do you make this default to Null?
    }    

    formatDollarsAndCents(myNumber) {
        return myNumber.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    getTotalInterest() {
        let princAndIntPayment = this.getPrincipalAndInterest();
        return (princAndIntPayment * this.termMonths) - this.getPrincipal();
    }

    getPrincipalAndInterest() {
        let interestMonthly = (this.interestRateBps / (12 * 10000));
        let loanTerm = this.termMonths;
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

    setTerm(termYears) {
        this.termMonths = termYears * 12
    }

    getTerm() {
        return this.termMonths / 12
    }

    getInterestRate() {
        return this.interestRateBps / 100;
    }

    toString() {
        return `Mortgage is for \$${this.getPrincipal()}, with a ${this.getInterestRate()}% interest rate, starting ${this.startDate}, with a term of ${this.getTerm()} years.`
    }
}

let myMortgage = new Mortgage(0.00, new Date(), '0');

//Add Each of The Elements to JS Script
const principalAmountField = document.getElementById("principalAmountInput");
const intertestRateField = document.getElementById("interestRateInput");
const startDateField = document.getElementById("startDateInput");
const radioTerm15 = document.getElementById("radioTerm15")
const radioTerm30 = document.getElementById("radioTerm30")
const annualTaxesField = document.getElementById("taxesInput");
const buttonCalc = document.getElementById("calculateButton");
const summaryTotalPayment = document.querySelector("#summaryTotalPayment p");
const summaryTotalInterest = document.querySelector("#summaryTotalInterest p")

//Adding Callbacks
intertestRateField.addEventListener('change', changeInterestRate)
radioTerm30.addEventListener('change', radioTermChange)
radioTerm15.addEventListener('change', radioTermChange)
buttonCalc.addEventListener('click', calculateMortgage)

function changeInterestRate() {
    myMortgage.setInterestRate(intertestRateField.value)
    console.log(myMortgage.toString());
}

function radioTermChange() {
    if (radioTerm30.checked) {
        myMortgage.setTerm(30);
        
    } else {
        myMortgage.setTerm(15);
    }
}

function calculateMortgage() {
    summaryTotalPayment.innerText = `\$${myMortgage.getPrincipalAndInterest()}`;
    summaryTotalInterest.innerText = `${myMortgage.formatDollarsAndCents(myMortgage.getTotalInterest())}`;
}

document.addEventListener('DOMContentLoaded', function(){
    //set defaults
    principalAmountField.value = `250000.00`;
    intertestRateField.value = `3.25`;
    startDateField.valueAsDate = new Date();
    annualTaxesField.value = `5000.00`;

    myMortgage.setPrincipal(principalAmountField.value);
    myMortgage.setInterestRate(intertestRateField.value);

    //default to 30 year term
    radioTerm30.checked = true;

    //force the change to trigger the listener
    let event = new Event('change');
    radioTerm30.dispatchEvent(event);
})








