let db;
const request = indexedDB.open('budget-tracker', 1)

request.onupgradeneeded = function(event) {
    // set the db reference to the passed in event
    const db = event.target.result;
    // Object Store that acts like a SQL table, name of objectStore is "expense" and has a self incrementing primary key.
    db.createObjectStore('expense', { autoIncrement: true });
}

request.onsuccess = function(event){
    db = event.target.result;

    if(navigator.onLine){uploadData()}
};

request.onerror = function(event){
    console.log(event.target.errorCode)
};

function saveRecord(data){
    const transaction = db.transaction(['expense'], 'readwrite');

    const depositObjectStore = transaction.objectStore('expense');

    depositObjectStore.add(data);
}

function uploadData(){
    const transaction = db.transaction(['expense'], 'readwrite');

    const depositObjectStore = transaction.objectStore('expense');

    const getAll = depositObjectStore.getAll();

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