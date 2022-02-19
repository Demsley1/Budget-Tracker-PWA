// create variable for database, and set a request variable that opens index db with custom name, and at the very least uses position 1.
let db;
const request = indexedDB.open('budget-tracker', 1)

request.onupgradeneeded = function(event) {
    // set the db reference to the passed in events result
    const db = event.target.result;
    // Object Store that acts like a SQL table, name of objectStore is "expense" and has a self incrementing primary key.
    db.createObjectStore('expense', { autoIncrement: true });
}

// run the funciton to send stored data to server if nvigator shows that it is back online.
request.onsuccess = function(event){
    db = event.target.result;

    if(navigator.onLine){uploadData()}
};

// error code logger
request.onerror = function(event){
    console.log(event.target.errorCode)
};


function saveRecord(data){
    // set up a new transaction for the database with read and write priviliges
    const transaction = db.transaction(['expense'], 'readwrite');

    // deposit the values in to be stored as an object 
    const depositObjectStore = transaction.objectStore('expense');

    // add the passed in values from the data parameters to created object store
    depositObjectStore.add(data);
}

function uploadData(){
    const transaction = db.transaction(['expense'], 'readwrite');

    const depositObjectStore = transaction.objectStore('expense');

    // Get and read the data in the selected indexed db database
    const getAll = depositObjectStore.getAll();

    // on success create a fetch request to a backend route for the server that will submit all data with a post request
    getAll.onsuccess = function(){
        if(getAll.result.length > 0){
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                }
            }).then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }

                // once information is sent to server and is stored in the mongodb database, clear the indexed db database that is used for app.
                const transaction = db.transaction(['expense'], 'readwrite');
                const depositObjectStore = transaction.objectStore('expense')
                depositObjectStore.clear();
                alert('All saved expenses have been submitted!');
            }).catch(err => console.log(err));
        }
    }
}

// listen for app coming back online
window.addEventListener('online', uploadData)