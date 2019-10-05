let currentSet = 'isd';
let app = document.getElementById('app');

async function getSets() {
    let response = await fetch('https://api.scryfall.com/sets');
    let data = await response.json();
    return data;
}

async function getCards(set) {
    let cardData = [];
    let response = await fetch(`https://api.scryfall.com/cards/search?order=rarity&q=set%3A${set}+-t%3Abasic`);
    let resJSON = await response.json();
    for (let i = 0; i < resJSON.data.length; i++) {
        cardData.push(resJSON.data[i]);
    }
    while (resJSON.has_more) {
        let pgResp = await fetch(resJSON.next_page);
        resJSON = await pgResp.json();
        for (let i = 0; i < resJSON.data.length; i++) {
            cardData.push(resJSON.data[i]);
        }
    }
    console.log(cardData);
    return cardData;
}

function mkTag(div, clss, content) {
    ht = document.createElement(div);
    ht.setAttribute('class', clss);
    ht.textContent = content;
    return ht;
}


async function setListPop() {
    info = await getSets();
    console.log(info.data);
    let setDrop = document.getElementById('setDrop');
    console.log(setDrop);
    for (let i = 0; i < info.data.length; i++) {
        let dropItem = mkTag('button', 'dropdown-item', info.data[i].name);
        // console.log(dropItem);
        setDrop.appendChild(dropItem);
    }
}

async function printCards() {
    cData = await getCards(currentSet);
    let p = mkTag('p', '', '');
    let output = '';
    for (let i = 0; i < cData.length; i++) {
        let count = 1;
        if (cData[i].rarity == 'common') {
            count = 3;
        } else if (cData[i].rarity == 'uncommon') {
            count = 2;
        }


        output += `${count} ${cData[i].name} <br>`;


        // console.log(output);
        p.innerHTML = output;
        app.appendChild(p);
    }

}
printCards();