import sendRequest from '@/scripts/get'
import {createArticle, createAddMoreArticlesButton, createSearchResultItem} from "@/scripts/dom";

export function getMinutes(millisecond) {
    let total_seconds = parseInt(Math.floor(millisecond / 1000));
    return parseInt(Math.floor(total_seconds / 60));
}

function getDays(millisecond) {
    let total_seconds = parseInt(Math.floor(millisecond / 1000));
    let total_minutes = parseInt(Math.floor(total_seconds / 60));
    let total_hours = parseInt(Math.floor(total_minutes / 60));
    return  parseInt(Math.floor(total_hours / 24));
}

function getArticleInfo(article_data) {
    const article_info = article_data.fields;

    const article_id = article_data.id;
    const article_title = article_info.headline;
    const article_description = article_info.trailText;
    const article_date = getDays(new Date() - new Date(article_info.firstPublicationDate));
    const article_img_link = article_info.thumbnail;
    const article_author = article_info.byline;
    const article_body = article_info.body;

    return {
        id: article_id,
        title: article_title,
        description: article_description,
        date: article_date,
        img_bg: article_img_link,
        author: article_author,
        body: article_body
    };
}

export function getArticles(type) {
    localStorage.setItem('articlesPageNumber', 1);
    const url = createUrl(type)
    sendRequest(url)
        .then(data => {
            const content = data.response.results
            // console.log(content[0])
            clearArticleList()
            for (let key in content) {
                const article = getArticleInfo(content[+key])
                createArticle(+key, article)
            }
            document.querySelector('.main').appendChild(createAddMoreArticlesButton());
        })
        .catch(error => console.log(error))
}

export function getMoreArticles() {
    const articlesPageNum = +localStorage.getItem('articlesPageNumber') + 1;
    localStorage.setItem('articlesPageNumber', articlesPageNum);
    const url = createUrl(localStorage.getItem('urlType'), articlesPageNum)
    sendRequest(url)
        .then(data => {
            const content = data.response.results;
            for (let key in content) {
                const article = getArticleInfo(content[+key])
                const article_id = +key + (articlesPageNum - 1) * 10;
                createArticle(article_id, article)
            }
        })
        .catch(error => console.log(error))
}

export function clearArticleList() {
    document.querySelector('#articleList').innerHTML = '';
    if (document.querySelector('#addMoreArticles')) {
        document.querySelector('#addMoreArticles').remove();
    }
}

function createUrl(type, page = 1) {
    return `https://content.guardianapis.com/search?q=${type}&show-tags=all&page-size=10&page=${page}&show-fields=all&order-by=relevance&api-key=5ef33414-1934-47dc-9892-5d09ab7c00da`
}

export function searchArticles(value, type, pageNum, max_items, max_tries = 500) {
    if (max_tries === 0){
        if (!localStorage.getItem('search_0')) {
            document.querySelector('.header__search-input').placeholder = 'No exact matches found';
        }
        return;
    }
    const url = createUrl(type, pageNum)
    sendRequest(url)
        .then(data => {
            const content = data.response.results;
            for (let key in content) {
                if (max_items === 0) {
                    break;
                }
                const article = getArticleInfo(content[+key])

                if (checkArticle(article.title, value)) {
                    const article_id = `search_${Math.abs(max_items - 10)}`;
                    createSearchResultItem(article_id, article.title)

                    localStorage.setItem(article_id, JSON.stringify(article))
                    document.querySelector('.header__search-input').placeholder = '';
                    max_items--;
                }
                max_tries--;
            }
            if (max_items   > 0) {
                searchArticles(value, type, pageNum + 1, max_items, max_tries)
            }

        })
        .catch(error => console.log(error))
}

function checkArticle(title, value) {
    let result = false;
    const arrayFromRuToEng = {
        'а': 'f', 'б': ',', 'в': 'd', 'г': 'u', 'д': 'l',
        'е': 't', 'ё': '`', 'ж': ';', 'з': 'p', 'и': 'b',
        'к': 'r', 'л': 'k', 'м': 'v', 'н': 'y', 'о': 'j',
        'п': 'g', 'р': 'h', 'с': 'c', 'т': 'n', 'у': 'e',
        'ф': 'a', 'х': '[', 'ц': 'w', 'ч': 'x', 'ш': 'i',
        'щ': 'o', 'ы': 's', 'э': "'", 'ю': '.', 'я': 'z',
        'ъ': ']', 'ь': 'm', 'й': 'q',
        'А': 'F', 'Б': '<', 'В': 'D', 'Г': 'U', 'Д': 'L',
        'Е': 'T', 'Ё': '~', 'Ж': ':', 'З': 'P', 'И': 'B',
        'К': 'K', 'Л': 'K', 'М': 'V', 'Н': 'Y', 'О': 'J',
        'П': 'G', 'Р': 'P', 'С': 'C', 'Т': 'N', 'У': 'E',
        'Ф': 'A', 'Х': '{', 'Ц': 'W', 'Ч': 'X', 'Ш': 'I',
        'Щ': 'O', 'Ы': 'S', 'Э': '"', 'Ю': '>', 'Я': 'Z',
        'Ъ': '}', 'Ь': 'M', 'Й': 'Q'
    }
    let valueSymbols = value.split('')
    let resultSymbols = valueSymbols.map(symbol => {
        let result = symbol;
        for (let key in arrayFromRuToEng) {
            if(symbol === key) {
                result = arrayFromRuToEng[key]
            }
        }
        return result;
    })
    console.log(resultSymbols.join(''))
    if (title.indexOf(resultSymbols.join('')) + 1) {
        result = true
    }
    return result;
}
