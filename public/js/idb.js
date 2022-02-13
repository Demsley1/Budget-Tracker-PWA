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

    if(navigator.onLine){//uploadData();
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode)
};

function saveRecord(data){
    const transaction = db.transaction(['expense'], 'readwrite');

    const depositObjectStore = transaction.objectStore('expense');

    depositObjectStore.add(data);
}