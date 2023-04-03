function userRoles(roles, id) {
    if(roles == undefined) return;
    if(!id) {
        const userRolesDiv = document.getElementsByClassName('username-roles');
        for (let i = 0; i < userRolesDiv.length; i++) {
            const div = userRolesDiv[i];

            for (let j = 0; j < roles.length; j++) {
                if(roles[j] == 1) div.innerHTML += '<i class="fas fa-check-circle" data-title="V.I.P."></i>';
                if(roles[j] == 2) div.innerHTML += '<i class="fas fa-user-shield" data-title="Moderátor"></i>';
                if(roles[j] == 3) div.innerHTML += '<i class="fas fa-hammer" data-title="Adminisztátor"></i>';
                if(roles[j] == 4) div.innerHTML += '<i class="fas fa-pencil-paintbrush" data-title="Dizájner"></i>';
                if(roles[j] == 5) div.innerHTML += '<i class="fas fa-code" data-title="Fejlesztő"></i>';
                if(roles[j] == 6) div.innerHTML += '<i class="fas fa-crown" data-title="Tulajdonos"></i>';
            }
        }
    } else if(id) {
        const userRolesDiv = document.getElementsByClassName('username-roles-custom ' + id)[0];
        for (let i = 0; i < roles.length; i++) {
            if(roles[i] == 1) userRolesDiv.innerHTML += '<i class="fas fa-check-circle" data-title="V.I.P."></i>';
            if(roles[i] == 2) userRolesDiv.innerHTML += '<i class="fas fa-user-shield" data-title="Moderátor"></i>';
            if(roles[i] == 3) userRolesDiv.innerHTML += '<i class="fas fa-hammer" data-title="Adminisztátor"></i>';
            if(roles[i] == 4) userRolesDiv.innerHTML += '<i class="fas fa-pencil-paintbrush" data-title="Dizájner"></i>';
            if(roles[i] == 5) userRolesDiv.innerHTML += '<i class="fas fa-code" data-title="Fejlesztő"></i>';
            if(roles[i] == 6) userRolesDiv.innerHTML += '<i class="fas fa-crown" data-title="Tulajdonos"></i>';
        }
    }
}

function formatDate(ipDate) {
    const date = new Date(ipDate);
    function addZero(i) {
        if (i < 10) {i = '0' + i}
        return i;
    }
    const text = `${date.getFullYear()}.${addZero(date.getMonth() + 1)}.${addZero(date.getDate())} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
    return text;
}

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = cName + '=' + cValue + '; ' + expires + `; path=/; domain=${useRuntimeConfig().cookieDomain}`;
}

function getCookie(cName) {
    const name = cName + '=';
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
}

function deleteCookie(cName) {
    document.cookie = cName + `=; path=/; expires=thu, 01 jan 1970 00:00:01 GMT; domain=${useRuntimeConfig().cookieDomain}`;
}

export default {
    userRoles,
    formatDate,
    setCookie,
    getCookie,
    deleteCookie
}