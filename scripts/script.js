let owner_id = -5880263
const token = 'ac62e3bfac62e3bfac62e3bfbcac146ce9aac62ac62e3bfcc56e32ae46260507dc7af8a'
const version = '5.126'
const api = 'https://api.vk.com/method/'
let currentGallery
let timeout
let hoveredElement

start()

function processPhotos(result) {
    let array = result.response.items.map(i => {
        let item_max_size = i.sizes.find(s => s.type === 'w') || i.sizes.find(s => s.type === 'z') || i.sizes.find(s => s.type === 'y') || i.sizes.find(s => s.type === 'x')
        return {src: item_max_size.url}
    })
    lightGallery(currentGallery, {
        hideBarsDelay: 1500,
        counter: true,
        enableDrag: false,
        dynamic: true,
        dynamicEl: array,
        mousewheel: true
    });
}

function processPreview(result) {
    let i = result.response.items[0]
    let item_max_size = i.sizes.find(s => s.type === 'w') || i.sizes.find(s => s.type === 'z') || i.sizes.find(s => s.type === 'y') || i.sizes.find(s => s.type === 'x')
    document.querySelector('body').style.backgroundImage = 'url(' + item_max_size.url + ')';

}

function processAlbums(result) {
    let items = result.response.items
    let albums_list = document.createElement('ul');
    items.forEach((item, i) => {
        let li = document.createElement('li')
        albums_list.append(li)
        let a = document.createElement('a')
        a.dataset.href = item.id
        a.href = '#'
        a.innerText = item.title.toUpperCase()
        a.dataset.pos = i
        a.onmouseover = i => {
            if (hoveredElement) hoveredElement.classList.remove('hover')
            a.className = 'hover'
            hoveredElement = a
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                let url = api + 'photos.get?rev=1&count=1&owner_id=' + owner_id + '&album_id=' + a.dataset.href + '&access_token=' + token + '&v=' + version + '&callback=processPreview'
                start(url)
            }, 500)
        }
        li.append(a)
        albums_list.append(li)
        a.onclick = () => {
            let url = api + 'photos.get?count=1000&owner_id=' + owner_id + '&album_id=' + a.dataset.href + '&access_token=' + token + '&v=' + version + '&callback=processPhotos'
            start(url)
            currentGallery = a
        }
    })
    document.getElementById('list').append(albums_list)
}

function start(custom_url) {
    let url = api + 'photos.getAlbums?owner_id=' + owner_id + '&access_token='+ token +'&v=' + version + '&callback=processAlbums'
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.src = custom_url || url
    script.id = 'script'
    let current_script = document.getElementById('script')
    if (current_script) head.removeChild(current_script)
    head.appendChild(script)
}