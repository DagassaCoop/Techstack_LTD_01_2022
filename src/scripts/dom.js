import search_input from '@/assets/search_input'
import search_input_stop from '@/assets/search_input_stop.png'
import scroll_top_arrow from '@/assets/scroll_top_arrow'
import {getArticles, getMoreArticles, clearArticleList, searchArticles, getMinutes} from "@/scripts/app";

// localStorage.setItem('urlType', 'Trending')

function scrollTo(to, duration = 700) {
    const
        element = document.scrollingElement || document.documentElement,
        start = element.scrollTop,
        change = to - start,
        startDate = +new Date(),
        easeInOutQuad = function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        animateScroll = function () {
            const currentDate = +new Date();
            const currentTime = currentDate - startDate;
            element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = to;
            }
        };
    animateScroll();
}

function getAddMoreArticlesButtonInfo() {
    return `
    <button class="learn-more">
        <span class="circle" aria-hidden="true">
          <span class="icon arrow"></span>
        </span>
        <span class="button-text">Add More Articles</span>
    </button>
    `
}

export function createAddMoreArticlesButton() {
    const btn = document.createElement('div')
    btn.id = 'addMoreArticles';
    btn.innerHTML = getAddMoreArticlesButtonInfo()
    btn.addEventListener('click', event => {
        getMoreArticles()
    })

    return btn;
}

function getSearchResultItem(id, title) {
    const location = document.location.href.split('/')[document.location.href.split('/').length - 1];
    const a = document.createElement('a')
    a.className = 'header__search-result-item'
    a.href = location === 'main.html' ? './temp/page.html' : '../temp/page.html'
    a.dataset.id = id;
    a.innerHTML = title
    return a;
}

export function createSearchResultItem(id, title) {
    const resItem = getSearchResultItem(id, title)
    document.querySelector('.header__search-result-list').appendChild(resItem)
}

function getArticle(id, text_title, text_description, text_date, img_bg, view_status, view_date) {
    return `
        <a href="../temp/page.html" class="article__img" data-id="${id}" style="background-image: url('${img_bg}')"></a>
        <div class="article__text">
            <h2 class="article__text-title">${text_title}</h2>
            <p class="article__text-description">${text_description}</p>
            <p class="article__text-date">Published ${text_date} days ago</p>
            <a href="../temp/page.html" class="article__text-link" data-id="${id}">Read more</a>
            <p class="article__text-status">${view_status === undefined ? 'Not viewed' : 'Viewed '+view_date+' minutes ago'}</p>
        </div>
`
}

export function createArticle(id, article) {

    if (localStorage.getItem('articleViewedList')) {
        const articleViewedList = JSON.parse(localStorage.getItem('articleViewedList'))
        for (let key in articleViewedList) {
            if (article.id === key) {
                article.viewStatus = articleViewedList[key].viewStatus;
                article.viewDate = getMinutes(new Date() - new Date(articleViewedList[key].viewDate));
            }
        }
    }

    localStorage.setItem(id, JSON.stringify(article))

    const newElem = document.createElement('article')
    newElem.className = `article ${id === 0 ? 'article_main' : ''} ${id % 3 === 0 ? 'article_last' : ''}`
    newElem.id = `article_${id}`
    newElem.innerHTML = getArticle(id, article.title, article.description, article.date, article.img_bg, article.viewStatus, article.viewDate)
    document.querySelector('#articleList').appendChild(newElem)

    if (id !== 0 && newElem.querySelector('.article__text-title').offsetHeight > 50) {
        const text = newElem.querySelector('.article__text-title').innerHTML
        newElem.querySelector('.article__text-title').innerHTML = text.split('').slice(0, 50).join('') + '...'
    }

    if (id === 0 && newElem.querySelector('.article__text-description').offsetHeight > 50) {
        const text = newElem.querySelector('.article__text-description').innerHTML
        newElem.querySelector('.article__text-description').innerHTML = text.split('').slice(0, 150).join('') + '...'
    }
    if (id !== 0 && newElem.querySelector('.article__text-description').offsetHeight > 80) {
        const text = document.querySelector('.article_main .article__text-description').innerHTML
        newElem.querySelector('.article__text-description').innerHTML = text.split('').slice(0, 150).join('') + '...'
    }


}


function searchInMain() {
    const input = document.querySelector('.header__search-input')
    const result_list = document.querySelector('.header__search-result-list')

    result_list.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        if (localStorage.getItem(`search_${i}`)) {
            localStorage.removeItem(`search_${i}`)
        }
    }

    localStorage.setItem('search_value', input.value)
    document.querySelector('.header__search-stop-img').classList.add('show');
    searchArticles(input.value, localStorage.getItem('urlType'), 1, 10)
    result_list.style.display = 'flex';
}

function checkSearchStorage() {
    if (localStorage.getItem('search_value')){
        document.querySelector('.header__search-input').value = localStorage.getItem('search_value')
        document.querySelector('.header__search-stop-img').classList.add('show')
        document.querySelector('.header__search-result-list').style.display = 'flex'
    }
    for (let i = 0; i < 10; i++) {
        if (localStorage.getItem(`search_${i}`)){
            const article = JSON.parse(localStorage.getItem(`search_${i}`))
            createSearchResultItem(`search_${i}`, article.title)
        }
    }
}


document.querySelector('.header__search-img').style.backgroundImage = `url(${search_input})`
document.querySelector('.header__search-stop-img').style.backgroundImage = `url(${search_input_stop})`
document.querySelector('.main__scroll-top-arrow').style.backgroundImage = `url(${scroll_top_arrow})`

if (document.location.href.split('/')[document.location.href.split('/').length - 1] === 'main.html' || document.location.href.split('/')[document.location.href.split('/').length - 1] === '') {
    document.querySelector('.header__logo-title').href = `./main.html`
} else {
    document.querySelector('.header__logo-title').href = `../main.html`
}

document.querySelector('#burgerItemCategories').addEventListener('mouseover', (event) => {
    document.querySelector('.burger__under-list-box').style.display = 'flex'
})

document.querySelector('#burgerItemCategories').addEventListener('mouseout', (event) => {
    document.querySelector('.burger__under-list-box').style.display = 'none'
})

document.querySelector('.burger__face').addEventListener('click', function () {
    document.querySelector('.burger__face span').classList.toggle('active');
    document.querySelector('.burger__list-box').classList.toggle('active');
})

document.querySelector('.burger__list-box').addEventListener('click', event => {
    if (event.target.dataset.link_type === "Category") {
        document.querySelector('.burger__face span').classList.toggle('active');
        document.querySelector('.burger__list-box').classList.toggle('active');

        const urlType = event.target.parentNode.id === 'burgerItemTrending' ? event.target.innerHTML.split(' ')[1] : event.target.innerHTML;
        event.preventDefault()
        clearArticleList()
        document.querySelector('#articleList').innerHTML = '<div class="loader"></div>'
        localStorage.setItem('urlType', urlType);
        getArticles(urlType);
    }
})

document.addEventListener('DOMContentLoaded', function () {
    if (document.location.href.split('/')[document.location.href.split('/').length - 1] === 'page.html') {
        const article = JSON.parse(localStorage.getItem(localStorage.getItem('pageFrom')))
        let articleViewedList = {}
        if (localStorage.getItem('articleViewedList')) {
           articleViewedList = JSON.parse(localStorage.getItem('articleViewedList'));
        }
        articleViewedList[article.id] = {viewStatus: true, viewDate: new Date()}
        localStorage.setItem('articleViewedList', JSON.stringify(articleViewedList))

        document.querySelector('.main_page__img').style.backgroundImage = `url(${article.img_bg})`
        document.querySelector('.main_page__text-title').innerHTML = article.title;
        document.querySelector('.main_page__text-content').innerHTML = article.body;
        document.querySelector('.main_page__text-date').innerHTML = article.date;
        document.querySelector('.main_page__text-author').innerHTML = `Written by ${article.author}`;
    } else {
        document.querySelector('#articleList').innerHTML = '<div class="loader"></div>'
        getArticles(localStorage.getItem('urlType'))
        checkSearchStorage()
    }

    window.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchInMain()
        }
    });



    let btn = document.querySelector('.main__scroll-top');
    window.addEventListener('scroll', function () {
        if (pageYOffset > 50) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.onclick = function (click) {

        click.preventDefault();
        scrollTo(0, 400);
    }


    window.addEventListener('click', (event) => {
        if (event.target.className === 'article__text-link' || event.target.className === 'article__img' || event.target.className === 'header__search-result-item') {
            localStorage.setItem('pageFrom', event.target.dataset.id)
        }
        if (event.target.className !== 'header__search-result-item' || event.target.className !== 'header__search-result-list' || event.target.className === 'header__search-stop-img') {
            const list = document.querySelector('.header__search-result-list');
            list.innerHTML = '';
            list.style.display = 'none';
            document.querySelector('.header__search-input').value = '';
            document.querySelector('.header__search-stop-img').classList.remove('show');
            localStorage.removeItem('search_value');
        }
    })


});


