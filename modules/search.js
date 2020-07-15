 export class Search {
    // пагинация / то что открываем по 20 юзеров - 2 / 40 юзеров - 3 
    setCurrentPage(pageNumber) {
        this.Current_Page = pageNumber;
    }; 
    setUsersCount(count) {
        this.usersCount = count;
    };
    //view, api, log - данные из соответствущих классов
    constructor(view, api, log) {
        this.view = view;
        this.api = api;
        this.log = log;
        //debugger
        this.view.searchInput.addEventListener('keyup', this.debounce(this.loadUsers.bind(this)) );
        //bind нужен чтобы взять значения именно this которое мы передаем через input / без bind просто передается сама функуция 
        this.view.loadMore.addEventListener('click', this.loadMoreUsers.bind(this));
        this.Current_Page = 0;
        this.usersCount = 0;
    }; 
     loadUsers() {
        this.setCurrentPage(1);
        this.view.setCounterMessage('');
        if (this.view.searchInput.value) {  
           this.clearUsers(); 
           this.usersRequest(this.view.searchInput.value);
    } else {
        //Когда в нашем инпуте нет значения
        this.clearUsers();
        this.view.toggleLoadMore(false);
    };
};
    loadMoreUsers() {
        this.setCurrentPage(this.Current_Page + 1);
        this.usersRequest(this.view.searchInput.value);
    };
async usersRequest(searchValue) {
    let totalCount;
    let users;
    let message;
    try {
        await this.api.loadUsers(searchValue, this.Current_Page).then((res) => { 
            // если запрос отвечает true / если статус в диапазоне 200-299 
            res.json().then( res => {
                users = res.items;
                totalCount = res.total_count;
                message = this.log.counterMessage(totalCount);
                this.setUsersCount(this.usersCount + users.length);
                this.view.setCounterMessage(message);
                //перебираем всех юзероев, которые соответствуют нашему value введенное в инпуте и создаем для них уже фото и подпись
                users.forEach (user => this.view.createUser(user));
                this.view.toggleLoadMore(this.usersCount < totalCount);
            });
        });
    } catch(e) {
        console.log('Error' + e);
    };
};
    clearUsers() {
        this.view.usersList.innerHTML = '';
    };
    // Задержка ввода данных для отправки запроса
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };  
}; 



