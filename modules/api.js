const URL = 'https://api.github.com/';
const USER_PER_PAGE = 20;

export class Api {
    async loadUsers(value, page) { 
        //debugger
        return await fetch(`${URL}search/users?q=${value}&per_page=${USER_PER_PAGE}&page=${page}`).then(res => res) 
        // per_page=20 Передаючи параметр per_page, ви можете вказати, скільки елементів, які потрібно повернути кожній сторінці
    };
    async loadUserData(login) {
        debugger
        const urls = [ 
            `${URL}users/${login}/following`,
            `${URL}users/${login}/followers`,
            `${URL}users/${login}/repos`,
        ]; 
        const requests = urls.map(url => fetch(url));
        return Promise.all(requests)
            .then(responses => Promise.all((responses.map(r => r.json()))));
    };
};