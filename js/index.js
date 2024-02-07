//Add Each of The Elements to JS Script
const principalAmountField = document.getElementById("principalAmountInput");
const intertestRateField = document.getElementById("interestRateInput");
const startDateField = document.getElementById("startDateInput");
const radioTerm15 = document.getElementById("radioTerm15")
const radioTerm30 = document.getElementById("radioTerm30")
const annualTaxesField = document.getElementById("taxesInput");
const buttonCalc = document.getElementById("calculateButton");
const summaryTotalPayment = document.querySelector("#summaryTotalPayment p");
const summaryPrincipalInterest = document.querySelector("#summaryPrincipalInterest p")
const summaryTotalInterest = document.querySelector("#summaryTotalInterest p");
const tablePaymentDetails = document.getElementById('tablePaymentDetails');

let myMortgage = new Mortgage(principalAmountField.value, intertestRateField.value, radioTerm30.checked ? 30 : 15);

document.addEventListener('DOMContentLoaded', function(){
    //set defaults
    //look to replace this - probably shouldn't have hardcoded values in the script.
    principalAmountField.value = `250000.00`;
    intertestRateField.value = `3.25`;
    startDateField.valueAsDate = new Date();
    annualTaxesField.value = `5000.00`;

    myMortgage.principalDollars = parseFloat(principalAmountField.value);
    myMortgage.interestRate = parseFloat(intertestRateField.value);

    //default to 30 year term
    //force the change to trigger the listener
    radioTerm30.checked = true;    
    let event = new Event('change');
    radioTerm30.dispatchEvent(event);

    console.log(myMortgage);
})


//Establish Mortgage
//console.log(myMortgage);

////Adding Callbacks
//intertestRateField.addEventListener('change', changeInterestRate)
radioTerm30.addEventListener('change', radioTermChange)
radioTerm15.addEventListener('change', radioTermChange)
buttonCalc.addEventListener('click', calculateMortgage)

function radioTermChange() {
    if (radioTerm30.checked) {
        myMortgage.loanTerm = 30;
    } else {
        myMortgage.loanTerm = 15;
    }
}

function calculateMortgage() {
    //summaryTotalPayment.innerText = `\$${myMortgage.getPrincipalAndInterest()}`;
    //summaryTotalInterest.innerText = `${myMortgage.formatDollarsAndCents(myMortgage.getTotalInterest())}`;
    console.log(myMortgage.calculateMortgageDetail());
    //summaryPrincipalInterest.innerText = `\$${pni[0]} / \$${pni[1]}`
    //console.log(myMortgage.getPrincipalAndInterestSplit());
    //console.log(myMortgage.calculateMortageDetail());
    //console.log(tablePaymentDetails);
    //tablePaymentDetails.innerHTML += myMortgage.calculateMortageDetail();
}

