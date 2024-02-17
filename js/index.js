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

//let db;

//function createDB() {
//    const req = indexedDB.open('mortgageDB', 6);
//    req.onsuccess = (event) => {
//        db = req.result;
//    };
//}

//const transaction = db.transaction('mortgage', 'readonly');
//console.log(transaction);

function getMortgageObject() {
    let db;
    const openDB = indexedDB.open('mortgageDB', 6);
    let myObj;
    openDB.onsuccess = (event) => {
        //console.log(openDB.result);
        //console.log(event.target.result);
        db = event.target.result;
        //console.log(db);
        //hardcoded values that can be replaced later
        const req = db.transaction('mortgage').objectStore('mortgage').get(63);

        req.onsuccess = () => {
            const myMortgageReq = req.result;
            //console.log(myMortgageReq.principalDollars)
            //principalAmountField.value = myMortgageReq.principalDollars;
            myMortgage.principalDollars = myMortgageReq.principalDollars;
            myMortgage.interestRate = myMortgageReq.interestRate;
            //intertestRateField.value = `3.25`;
            //startDateField.valueAsDate = new Date();
            //annualTaxesField.value = myMortgage.;

            //console.log(myMortgage);
            //myObj = myMortgage;
        }
        
        req.onerror = (error) => {
            console.error("Error:", error);
        }
    };    
}

document.addEventListener('DOMContentLoaded', function(){
    let db;
    const openDB = indexedDB.open('mortgageDB', 6);
    //let myObj;
    openDB.onsuccess = (event) => {
        //console.log(openDB.result);
        //console.log(event.target.result);
        db = event.target.result;
        //console.log(db);
        //hardcoded values that can be replaced later
        const req = db.transaction('mortgage').objectStore('mortgage').get(63);

        req.onsuccess = () => {
            const myMortgageReq = req.result;
            //console.log(myMortgageReq.principalDollars)
            //principalAmountField.value = myMortgageReq.principalDollars;
            myMortgage.principalDollars = myMortgageReq.principalDollars;
            myMortgage.interestRate = myMortgageReq.interestRate;
            //intertestRateField.value = `3.25`;
            //startDateField.valueAsDate = new Date();
            //annualTaxesField.value = myMortgage.;

            console.log(myMortgage);
            console.log(myMortgage.principalDollars);
            principalAmountField.value = `${myMortgage.principalDollars}`;
            intertestRateField.value = myMortgage.interestRate; //`3.25`;
            startDateField.valueAsDate = new Date();
            annualTaxesField.value = `5000.00`;

            //console.log(myMortgage);
            //myObj = myMortgage;
        }
        
        req.onerror = (error) => {
            console.error("Error:", error);
        }
    }; 
    //const myInitMortgage = resolve(openDB('mortgage', 1));
    //console.log(resolve(myInitMortgage));

    //console.log(getMortgageObject());

    //set defaults
    //look to replace this - probably shouldn't have hardcoded values in the script.
    

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
    //console.log('NO WAY');
    saveOrUpdateObjectToIndexedDB(myMortgage, 'mortgageDB');
    //console.log('ME TOO');
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

