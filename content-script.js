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

    // api call
    data = [
        {
            title: 'title1',
            content: 'content1'
        },
        {
            title: 'title2',
            content: 'content2'
        }
    ]

    cards = document.createElement('div')
    data.forEach(element => {
        card = document.createElement('div')
        card.innerHTML = `
            <div class="title"> ${element.title} </div>
            <div class="content"> ${element.content} </div>
            <hr/>
        `
        cards.appendChild(card)
    });

    this.dest.innerHTML = cards.innerHTML
}


Panel.prototype.pos = function (pos) {
    this.container.style.top = pos.y + 'px'
    this.container.style.left = pos.x + 'px'
}


let panel = new Panel()


window.onmouseup = function (e) {
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