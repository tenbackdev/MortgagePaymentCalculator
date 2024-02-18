//const Mortgages = require('./mortgage');

const myNewMortgage = new Mortgage(100000.00, 6.75, 30);
console.log(myNewMortgage);

class OldMortgage {
    constructor(interestRate, startDate, principal) {
        this.interestRateBps = interestRate * 100;
        this.startDate = new Date(startDate);
        this.principalCents = principal * 100; //Is there a way to DRY this up?
        this.termMonths = 360; //How do you make this default to Null?
    }    

    formatDollarsAndCents(myNumber) {
        return myNumber.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    formatPaymentMonth(paymentDate) {
        var curDate = new Date(paymentDate)
            , month = '' + (curDate.getMonth() + 1)
            , year = curDate.getFullYear();

        return [year, month.length < 2 ? '0' + month : month].join('-'); 
    }

    getTotalInterest() {
        let princAndIntPayment = this.getPrincipalAndInterest();
        return (princAndIntPayment * this.termMonths) - this.getPrincipal();
    }

    getPrincipalAndInterest() {
        let interestMonthly = (this.interestRateBps / (12 * 10000)); //How do I make this DRY?
        let loanTerm = this.termMonths;
        let interestCalc = (1.0 + interestMonthly) ** loanTerm;
        //console.log(`IM: ${interestMonthly}, LT: ${loanTerm}, IC: ${interestCalc}`)
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

    getPrincipalAndInterestSplit() {
        let totalPI = this.getPrincipalAndInterest();
        let interestMonthly = (this.interestRateBps / (12 * 10000)); //How do I make this DRY?
        let interestPayment = Math.round((interestMonthly * this.principalCents), 0) / 100
        console.log(interestPayment);
        return [Math.round(100 * (totalPI - interestPayment), 0) / 100, interestPayment];
    }

    getInterestRate() {
        return this.interestRateBps / 100;
    }

    get annualTaxes() {
        return this.termMonths * 12;
    }

    set annualTaxes(taxAmount) {
        return this.termMonths / 12;
    }

    calculateMortageDetail() {
        let outstandingPrincipalCents = this.principalCents;
        let minPrincIntPaymentCents = this.getPrincipalAndInterest() * 100;
        let monthNumber = 0;
        let interestRunningTotalCents = 0;
        let curInterestCents, curPrincipalCents, curPrincipalInterestCents; 
        let htmlInnerText = '<tbody>';
        console.log(`OPC: ${outstandingPrincipalCents}, MPIP: ${minPrincIntPaymentCents}`)

        while (outstandingPrincipalCents > 0) {
            monthNumber+=1
            curInterestCents = Math.round(outstandingPrincipalCents * (this.interestRateBps / (12 * 10000)), 0);
            
            //handle final payment scenario where total payment may be less than the minimum payment
            if (outstandingPrincipalCents >= minPrincIntPaymentCents) {
                curPrincipalCents = minPrincIntPaymentCents - curInterestCents;  
                curPrincipalInterestCents = minPrincIntPaymentCents;            
            } else {
                curPrincipalCents = outstandingPrincipalCents;
                curPrincipalInterestCents = outstandingPrincipalCents + curInterestCents;
            }
            
            interestRunningTotalCents += curInterestCents;
            outstandingPrincipalCents -= curPrincipalCents;
            //console.log(`MN: ${monthNumber}, MPIPC: ${minPrincIntPaymentCents}, CIC: ${curInterestCents}, CPC: ${curPrincipalCents}`)
            //console.log(`IRTC: ${interestRunningTotalCents}, OPC: ${outstandingPrincipalCents}`);
            
            //work to add these to final list of rows of html to be returned.
            htmlInnerText += `<tr>
                <td>${monthNumber}</td>
                <td>${this.formatPaymentMonth(new Date(this.startDate.setMonth(this.startDate.getMonth() + (monthNumber === 1 ? 0 : 1))))}</td>
                <td>${this.formatDollarsAndCents(curPrincipalInterestCents / 100)}</td>
                <td>${this.formatDollarsAndCents(curPrincipalCents / 100)}</td>
                <td>${this.formatDollarsAndCents(curInterestCents / 100)}</td>
                <td>$50.00</td>
                <td>${this.formatDollarsAndCents(outstandingPrincipalCents / 100)}</td>
                <td>${this.formatDollarsAndCents(interestRunningTotalCents / 100)}</td>
            </tr>`;

            //if(monthNumber === 3) {
            //    break;
            //}
        }

        //add closing tbody tag at end
        htmlInnerText += '</tbody>'

        return htmlInnerText;
    }

    toString() {
        return `Mortgage is for \$${this.getPrincipal()}, with a ${this.getInterestRate()}% interest rate, starting ${this.startDate}, with a term of ${this.getTerm()} years.`
    }
}

let myMortgage = new OldMortgage(0.00, new Date(), '0');

//Add Each of The Elements to JS Script
const principalAmountField = document.getElementById("principalAmountInput");
const intertestRateField = document.getElementById("interestRateInput");
const startDateField = document.getElementById("startDateInput");
const radioTerm15 = document.getElementById("radioTerm15")
const radioTerm30 = document.getElementById("radioTerm30")
const principalAmountField = document.getElementById("principalAmountInput");
const annualTaxesField = document.getElementById("taxesInput");
const buttonCalc = document.getElementById("calculateButton");
const summaryTotalPayment = document.querySelector("#summaryTotalPayment p");
const summaryPrincipalInterest = document.querySelector("#summaryPrincipalInterest p")
const summaryTotalInterest = document.querySelector("#summaryTotalInterest p");
const tablePaymentDetails = document.getElementById('tablePaymentDetails');

//Adding Callbacks
intertestRateField.addEventListener('change', changeInterestRate)
radioTerm30.addEventListener('change', radioTermChange)
radioTerm15.addEventListener('change', radioTermChange)
buttonCalc.addEventListener('click', calculateMortgage)

function changeInterestRate() {
    myMortgage.setInterestRate(intertestRateField.value)
    ///console.log(myMortgage.toString());
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
    let pni = myMortgage.getPrincipalAndInterestSplit();
    summaryPrincipalInterest.innerText = `\$${pni[0]} / \$${pni[1]}`
    //console.log(myMortgage.getPrincipalAndInterestSplit());
    //console.log(myMortgage.calculateMortageDetail());
    //console.log(tablePaymentDetails);
    tablePaymentDetails.innerHTML += myMortgage.calculateMortageDetail();
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
    //console.log(myMortgage.annualTaxes = 50);
    //console.log(myMortgage.annualTaxes);
})








