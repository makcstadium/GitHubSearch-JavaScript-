export class View {
        constructor(api) {
            this.app = document.getElementById('app'); 
            this.api = api;

            this.title = this.createElement('h1', 'title');
            this.title.textContent = "GitHub Search Users"; 

            this.searchLine = this.createElement('div', 'search-line'); 
            this.searchInput = this.createElement('input', 'search-input');
            this.searchCounter = this.createElement('span', 'counter');

            this.searchLine.append(this.searchInput); 
            this.searchLine.append(this.searchCounter);

            this.usersWrapper = this.createElement('div', 'users-wrapper');
            this.usersList = this.createElement('ul', 'users');
            this.userWrapper = this.createElement('div', 'user-info');
            this.usersWrapper.append(this.usersList);

            this.loadMore = this.createElement('button', 'btn');
            this.loadMore.textContent = "Load more";
            this.loadMore.style.display = 'none';

            this.usersWrapper.append(this.LoadMore);

            this.main = this.createElement('div', 'main');
            this.main.append(this.usersWrapper);
            this.main.append(this.userWrapper);

            this.app.append(this.title);
            this.app.append(this.searchLine); 
            this.app.append(this.main); 
        };
        // создаем наши элементы 
        createElement(elementTag, elementClass) {
            const element = document.createElement(elementTag)
            if(elementClass) {
                element.classList.add(elementClass);
            }; 
            return element
        };

        //создаем юзеров / которых мы ввели через инпут 
        createUser(userData) {
            const userElement = this.createElement('li', 'user-prev');
            userElement.addEventListener('click', () =>  this.showUserData(userData));
            userElement.innerHTML = `<img class="user-prev-photo" src="${userData.avatar_url}" alt="${userData.login}"> 
                                    <span class="user-prev-name">${userData.login}</span>`; 
            this.usersList.append(userElement);
        };

        showUserData(userData) {
            const userEl = this.createElement('div', 'user');
            this.usersWrapper.style.width = '60%';
            this.userWrapper.innerHTML = '';
            this.api.loadUserData(userData.login)
                .then(res => {
                const [following, followers, repos] = res;
                const followingList = this.createDatalist(following, 'Following'); 
                const followersList = this.createDatalist(followers, 'Followers'); 
                const reposList = this.createDatalist(repos, 'Repos'); 
                userEl.innerHTML = `<img src="${userData.avatar_url}" style="width: 300px">
                                    <h2>${userData.login}</h2>
                                     ${followingList}
                                     ${followersList}
                                     ${reposList}`;
            });
            this.userWrapper.append(userEl);
        };

        createDatalist(list, title) {
            const block = this.createElement('div', 'user-block');
            const titleTag = this.createElement('h3', 'user-block-title');
            const listTag = this.createElement('ul', 'user-list');
            titleTag.textContent = title;

            list.forEach(item => {
                const el = this.createElement('li','user-list-item');
                let itemLogin = item.login; 
                if (item.login == undefined) {
                    itemLogin = item.name;
                }
                el.innerHTML = `<a href="${item.html_url}" target="_blank">${itemLogin}</a>` ;
                listTag.append(el);
            });

            block.append(titleTag);
            block.append(listTag);
            
            return block.innerHTML;
        }

        //показываем кнопку
        toggleLoadMore(show) {
            this.loadMore.style.display = show ? 'block' : 'none'; 
        }; 

        //показываем количество всех юзеров
        setCounterMessage(message) {
            this.searchCounter.textContent = message;
        };
};