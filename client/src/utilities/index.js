// list of all months in english word
export let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


let getToday = function(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
};
export let today = getToday();


let getTesterday = function(){
    let today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let y_dd = String(yesterday.getDate()).padStart(2, '0');
    let y_mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    let y_yyyy = yesterday.getFullYear();

    return  y_yyyy + '-' + y_mm + '-' + y_dd;
};
export let yesterday = getTesterday();

let getCurrentMonth = function(){
    let today = new Date();
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    return yyyy + '-' + mm;
};

export let currentMonth = getCurrentMonth();

// get first and last character from string
let getInitials = function (name) {
    var names = name.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
}

export let toInitials = getInitials;
