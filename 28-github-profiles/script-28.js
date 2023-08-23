const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

async function getUser(username) {
    try {
        const { data }= await axios(APIURL + username);
        createUserCard(data);
        getRepos(username).then();
    } catch (err) {
        if (err.response.status === 404) {
            createErrorCard('No profile with this username');
        }
    }

}

function createUserCard(user) {
    main.innerHTML = `
        <div class="card">
        <div>
            <img src="${user.avatar_url}" alt="" class="avatar">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            
            <ul>
                <li>${user.followers} <strong>Followers</strong></li>
                <li>${user.following} <strong>Following</strong></li>
                <li>${user.public_repos} <strong>Repos</strong></li>
            </ul>
            
            <div id="repos">
            
            </div>
        </div>
    </div>
    `;

}

async function getRepos(username) {
    try {
        const { data }= await axios(APIURL + username + '/repos?sort=created');
        console.log(data);
        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem fetching repos');
    }
}

function createErrorCard(msg) {
    main.innerHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>`;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');

    repos
        .slice(0, 10)
        .forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.classList.add('repo');
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.innerText = repo.name;
        reposEl.appendChild(repoEl);
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const user = search.value;
    console.log(user);

    if (user) {
        getUser(user).then();
        search.value = '';
    }
})
