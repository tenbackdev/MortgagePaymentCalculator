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
const tablePaymentDetailsBody = document.getElementById('tablePaymentDetailsBody');

let myMortgage = new Mortgage(principalAmountField.value, intertestRateField.value, radioTerm30.checked ? 30 : 15);

function formatDollarsAndCents(myNumber) {
    return myNumber.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
}

function saveOrUpdateObjectToIndexedDB(objectToSave, objectStoreName) {
    const request = indexedDB.open('mortgageDB', 1);

    request.onerror = function(event) {
        console.error(`IndexedDB error: ${event.target.errorCode}`)
        
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        
        const transaction = db.transaction("mortgageDB", "readwrite");
        console.log(db);
        const objectStore = transaction.objectStore("testThisName");

        //Check if the obect already exists
        console.log(objectToSave.id);
        const getRequest = objectStore.get(objectToSave.id);

        getRequest.onsuccess = function(event) {
            const existingObject = event.target.result;
            
            

            //If Object exists, update it. Else - add it
            const addOrUpdateRequest = existingObject ? objectStore.put(objectToSave) : objectStore.add(objectToSave);
            addOrUpdateRequest.onsuccess = function(event) {
                console.log('Object saved or updated in IndexedDB');
            };

            addOrUpdateRequest.onerror = function(event) {
                console.error('Error saving or updating object in IndexedDB', event.target.error);
            };
        };
        
        getRequest.onupgradeneeded = function(event) {
            console.log('HELP')
        }

        getRequest.onerror = function(event) {
            
            console.error('Error retreiving object from IndexedDB', event.target.error);
        }
    }
}

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


    event = new Event('click')
    buttonCalc.dispatchEvent(event);

    //console.log(myMortgage);
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
    myMortgage.principalDollars = parseFloat(principalAmountField.value);
    myMortgage.interestRate = parseFloat(intertestRateField.value);
    //summaryTotalPayment.innerText = `\$${myMortgage.getPrincipalAndInterest()}`;
    //summaryTotalInterest.innerText = `${myMortgage.formatDollarsAndCents(myMortgage.getTotalInterest())}`;
    //let pni = myMortgage.getPrincipalAndInterestSplit();
    //summaryPrincipalInterest.innerText = `\$${pni[0]} / \$${pni[1]}`
    //console.log(myMortgage.getPrincipalAndInterestSplit());
    //console.log(myMortgage.calculateMortageDetail());
    //console.log(tablePaymentDetails);
    //console.log(myMortgage);
    tablePaymentDetailsBody.innerHTML = "";
    tablePaymentDetailsBody.innerHTML = populateMortgageDetail();
    console.log('NO WAY');
    saveOrUpdateObjectToIndexedDB(myMortgage, 'mortgageDB');
    console.log('ME TOO');
}

function populateMortgageDetail() {
    //summaryTotalPayment.innerText = `\$${myMortgage.getPrincipalAndInterest()}`;
    //summaryTotalInterest.innerText = `${myMortgage.formatDollarsAndCents(myMortgage.getTotalInterest())}`;
    let htmlInnerText = ''; //= '<tbody>';
    let amortSchedJSON = myMortgage.calculateMortgageDetail();
    for (let payment in amortSchedJSON) {
        //work to add these to final list of rows of html to be returned.
        
        htmlInnerText += `<tr>
            <td>${amortSchedJSON[payment].paymentNumber}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].principalInterest)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].principal)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].interest)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].principalOutstanding)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].interestRunningTotal)}</td>
        </tr>`;

    };
    //add closing tbody tag at end
    //htmlInnerText += '</tbody>'
    return htmlInnerText;
    //summaryPrincipalInterest.innerText = `\$${pni[0]} / \$${pni[1]}`
    //console.log(myMortgage.getPrincipalAndInterestSplit());
    //console.log(myMortgage.calculateMortageDetail());
    //console.log(tablePaymentDetails);
    //tablePaymentDetails.innerHTML += myMortgage.calculateMortageDetail();
}

