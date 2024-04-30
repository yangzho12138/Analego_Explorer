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
    this.container.style.position = 'fixed'
    this.container.style.bottom = '0%'
    this.container.style.right = '0%'

     // Initialize variables for drag functionality
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;

    // Add event listeners for drag functionality
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
}

Panel.prototype.handleMouseDown = function (event) {
    this.dragging = true;
    this.offsetX = event.clientX - parseInt(this.container.style.right);
    this.offsetY = event.clientY - parseInt(this.container.style.bottom);
}

Panel.prototype.handleMouseUp = function () {
    this.dragging = false;
}

document.addEventListener('mousemove', function (event) {
    if (panel.dragging) {
        var newX = event.clientX - panel.offsetX;
        var newY = event.clientY - panel.offsetY;
        panel.container.style.left = `${Math.max(0, newX)}px`;
        panel.container.style.top = `${Math.max(0, newY)}px`;
    }
});

let panel = new Panel()


window.onmouseup = function (e) {
    console.log(selectState)
    if (selectState === 'off') 
        return
    
    let raw = window.getSelection().toString().trim()

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