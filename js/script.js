class Mortgage {
    constructor(interestRate, startDate, principal) {
        this.interestRateBps = interestRate * 100;
        this.startDate = startDate;
        this.principalCents = principal * 100; //Is there a way to DRY this up?
        this.termMonths = 360; //How do you make this default to Null?
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

    setTerm(termYears) {
       
        this.termMonths = termYears * 12
        console.log('HELLO')
        console.log(this.termMonths)
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

const myMortgage = new Mortgage(3.25, '2024-01-22', '260000.00');
console.log(myMortgage.getPrincipalAndInterest());

//Add Each of The Elements to JS Script
const startDateField = document.getElementById("startDateInput");
const intertestRateField = document.getElementById("interestRateInput");
const radioTerm15 = document.getElementById("radioTerm15")
const radioTerm30 = document.getElementById("radioTerm30")

//Adding Callbacks
intertestRateField.addEventListener('change', changeInterestRate)
radioTerm30.addEventListener('change', radioTermChange)
radioTerm15.addEventListener('change', radioTermChange)

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

document.addEventListener('DOMContentLoaded', function(){
    //default to 30 year term
    radioTerm30.checked = true;

    //force the change to trigger the listener
    let event = new Event('change');
    radioTerm30.dispatchEvent(event);
})

console.log(myMortgage.toString());
console.log(myMortgage.termMonths)

console.log(Object.keys(myMortgage))








