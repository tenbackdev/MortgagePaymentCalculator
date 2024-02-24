//Add Each of The Elements to JS Script
const principalAmountField = document.getElementById("principalAmountInput");
const intertestRateField = document.getElementById("interestRateInput");
const startDateField = document.getElementById("startDateInput");
const radioTerm15 = document.getElementById("radioTerm15")
const radioTerm30 = document.getElementById("radioTerm30")
const additionalPrincipalField = document.getElementById("additionalPrincipalAmountInput");
const annualTaxesField = document.getElementById("taxesInput");
const buttonCalc = document.getElementById("calculateButton");
const summaryTotalPayment = document.querySelector("#summaryTotalPayment p");
const summaryPrincipalInterest = document.querySelector("#summaryPrincipalInterest p")
const summaryTotalInterest = document.querySelector("#summaryTotalInterest p");
const tablePaymentDetailsBody = document.getElementById('tablePaymentDetailsBody');

let myMortgage = new Mortgage(principalAmountField.value, intertestRateField.value, radioTerm30.checked ? 30 : 15);
//console.log(myMortgage);

function formatDollarsAndCents(myNumber) {
    return myNumber.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
}

function saveOrUpdateObjectToIndexedDB(objectToSave, objectStoreName) {
    const request = indexedDB.open('mortgageDB', 6);

    request.onerror = function(event) {
        console.error(`IndexedDB error: ${event.target.errorCode}`)
        
    };

    request.onupgradeneeded = function(event) {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('mortgage')) {
            db.createObjectStore('mortgage', {keyPath: 'id', autoIncrement: true});
            console.log('testing this object store');
        }
    }


    request.onsuccess = function(event) {
        const db = event.target.result;
        //console.log(db);
        const transaction = db.transaction(['mortgage'], "readwrite");
        //console.log(db);
        const objectStore = transaction.objectStore("mortgage");

        const getRequest = objectStore.put(objectToSave);

        getRequest.onsuccess = function(event) {
            console.log('successfully added');
        };
        

        getRequest.onerror = function(event) {
            
            console.error('Error retreiving object from IndexedDB', event.target.error);
        }
    }
}

function openDB(objectStoreName, objectId) {
    return new Promise(
        function(resolve, reject) {
            const request = indexedDB.open('mortgageDB', 6);

            request.onsuccess = function (event) {
                const db = event.target.result;
                const myObj = db.transaction([objectStoreName], 'readwrite').objectStore(objectStoreName).get(objectId);
                //console.log(myObj);
                myObj.onsuccess = function(event) {
                    resolve(event.target.result);
                }
            }

            request.onerror = function(event) {
                reject(event.target.result);
            };
        }
    );
}

document.addEventListener('DOMContentLoaded', function(){
    let db;
    const openDB = indexedDB.open('mortgageDB', 6);
    //let myObj;

    myMortgage.principalDollars = parseFloat(principalAmountField.value);
    myMortgage.interestRate = parseFloat(intertestRateField.value);
    myMortgage.additionalPrincipal = parseFloat(additionalPrincipalField.value);

    openDB.onsuccess = (event) => {
        //console.log(openDB.result);
        //console.log(event.target.result);
        db = event.target.result;
        //console.log(db);
        //hardcoded values that can be replaced later
        //below logic in req.onsuccess errors out if this comes back negative.
        let req = db.transaction('mortgage').objectStore('mortgage').get(133);

        //req = req ? req : myMortgage;

        req.onsuccess = () => {
            const myMortgageReq = req.result;
            //console.log(myMortgageReq.principalDollars)
            //principalAmountField.value = myMortgageReq.principalDollars;
            myMortgage.principalDollars = myMortgageReq.principalDollars ? myMortgageReq.principalDollars : myMortgage.principalDollars;
            myMortgage.interestRate = myMortgageReq.interestRate;
            myMortgage.additionalPrincipal = myMortgageReq.additionalPrincipal ? myMortgageReq.additionalPrincipal : 0;
            principalAmountField.value = `${myMortgage.principalDollars}`;
            intertestRateField.value = myMortgage.interestRate; //`3.25`;
            additionalPrincipalField.value = myMortgage.additionalPrincipal;
            startDateField.valueAsDate = new Date();
            annualTaxesField.value = `5000.00`;

            //console.log(myMortgage);
            //myObj = myMortgage;
        }
        
        req.onerror = (error) => {
            console.error("Error:", error);
        }
    }; 

    //default to 30 year term
    //force the change to trigger the listener
    radioTerm30.checked = true;    
    let event = new Event('change');
    radioTerm30.dispatchEvent(event);


    event = new Event('click')
    buttonCalc.dispatchEvent(event);

    //console.log(myMortgage);
})

////Adding Callbacks
//intertestRateField.addEventListener('change', changeInterestRate)
radioTerm30.addEventListener('change', radioTermChange)
radioTerm15.addEventListener('change', radioTermChange)
additionalPrincipalField.addEventListener('change', addtlPrincChange)
buttonCalc.addEventListener('click', calculateMortgage)

function addtlPrincChange() {
    myMortgage.additionalPrincipal = parseFloat(additionalPrincipalField.value);
}

function radioTermChange() {
    if (radioTerm30.checked) {
        myMortgage.loanTerm = 30;
    } else {
        myMortgage.loanTerm = 15;
    }
}

function calculateMortgage() {
    calcMortgage = new Mortgage(
        parseFloat(principalAmountField.value)
        , parseFloat(intertestRateField.value)
        , radioTerm30.checked ? 30 : 15
        , parseFloat(additionalPrincipalField.value)
    )
    tablePaymentDetailsBody.innerHTML = "";
    tablePaymentDetailsBody.innerHTML = populateMortgageDetail(calcMortgage);
    saveOrUpdateObjectToIndexedDB(calcMortgage, 'mortgageDB');
}

function populateMortgageDetail(dtlMortgage) {
    
    let htmlInnerText = ''; //= '<tbody>';
    let amortSchedJSON = dtlMortgage.calculateMortgageDetail();
    console.log(amortSchedJSON.at(-1));
    summaryTotalPayment.innerText = `\$${amortSchedJSON[0]['principalInterest']}`;
    summaryPrincipalInterest.innerText = `\$${amortSchedJSON[0]['principal']} / \$${amortSchedJSON[0]['interest']}`
    summaryTotalInterest.innerText = `${formatDollarsAndCents(amortSchedJSON.at(-1)['interestRunningTotal'])}`;
    for (let payment in amortSchedJSON) {
        //work to add these to final list of rows of html to be returned.
    
        htmlInnerText += `<tr>
            <td>${amortSchedJSON[payment].paymentNumber}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].totalPayment)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].principal)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].interest)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].additionalPrincipal)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].principalOutstanding)}</td>
            <td>${formatDollarsAndCents(amortSchedJSON[payment].interestRunningTotal)}</td>
        </tr>`;

    };

    return htmlInnerText;
}

