function Panel() {
    this.create()
    this.bind()
}

Panel.prototype.create = function () {
    let container = document.createElement('div')

    let html = `
        <header>Analego Search<span class="close">X</span></header>
        <main>
            <div class="source">
                <div class="title">Search Key Words</div>
                <!-- dynamic insert -->
                <div class="content"></div>
            </div>
            <div class="dest">
                <div class="title">Analogies</div>
                <!--api call, async -->
                <div class="content">...</div>
            </div>
        </main>
    `

    container.innerHTML = html
    
    // container.classList.add('translate-panel')
    container.classList.add('search-panel')
    
    document.body.appendChild(container)
    
    this.container = container
    
    this.close = container.querySelector('.close')
    
    this.source = container.querySelector('.source .content')
    
    this.dest = container.querySelector('.dest .content')
}


Panel.prototype.show = function () {
    this.container.classList.add('show')
}

Panel.prototype.hide = function () {
    this.container.classList.remove('show')
}


Panel.prototype.bind = function () {
    this.close.onclick = () => {
        this.hide()
    }
}

Panel.prototype.search = function(raw){
    this.source.innerText = raw
    this.dest.innerText = '...'

    // const apiUrl = 'https://timan.cs.illinois.edu/analegosearch/api/search';

    // // api call
    // fetch(apiUrl, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         "query": raw
    //     })
    // }).then(res => res.json()).then(res => {
    //     data = res.docs;
    //     console.log(data)
    //     cards = document.createElement('div')
    //     data.forEach(element => {
    //         card = document.createElement('div')
    //         card.innerHTML = `
    //             <div class="title"> ${element.title} </div>
    //             <div class="content"> ${element.content} </div>
    //             <hr/>
    //         `
    //         cards.appendChild(card)
    //     });

    //     this.dest.innerHTML = cards.innerHTML
    // })

    chrome.runtime.sendMessage({
        action: "search",
        apiUrl: 'https://timan.cs.illinois.edu/analegosearch/api/search',
        query: raw
    }, response => {
        if (response.success) {
            const data = response.data.docs;
            console.log(data);
            const cards = document.createElement('div');
            data.forEach(element => {
                const card = document.createElement('div');
                card.innerHTML = `
                    <div class="title"> Target: ${element.target} </div>
                    <div class="title"> Prompt: ${element.prompt} </div>
                    <div class="content"> ${element.analogy} </div>
                    <hr/>
                `;
                cards.appendChild(card);
            });
            this.dest.innerHTML = cards.innerHTML;
        } else {
            console.error('Error:', response.error);
            this.dest.innerText = 'Error loading data.';
        }
    });    
}


Panel.prototype.pos = function (pos) {
    this.container.style.top = pos.y + 'px'
    this.container.style.left = pos.x + 'px'
}


let panel = new Panel()


window.onmouseup = function (e) {
    console.log(selectState)
    if (selectState === 'off') 
        return
    
    let raw = window.getSelection().toString().trim()

    if(contentAwareState === 'on'){
        // advanced content aware function
        console.log('content aware')
    }

    let x = e.pageX
    let y = e.pageY

    if (!raw) {
        return
    } else {
        panel.pos({x: x, y: y})
        // panel.translate(raw)
        console.log(raw)
        panel.search(raw)
        panel.show()
    }
}


let selectState = 'off'

chrome.storage.sync.get(['switch'], function (result) {
    if (result.switch) {
        selectState = result.switch
    }
});

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.switch) {
            selectState = request.switch
        }
});

let contentAwareState = 'off'

chrome.storage.sync.get(['contentAware'], function (result) {
    if (result.contentAware) {
        contentAwareState = result.contentAware
    }
});

chrome.runtime.onMessage.addListener(
    function (request) {
        if (request.contentAware) {
            contentAwareState = request.contentAware
        }
});