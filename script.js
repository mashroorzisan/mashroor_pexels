const apiKey = 'g7oLB8CfsYIeWJnJHg5jkYik1MiRZ7hgmPsrVCuPGGrj6dA3YntI6JOl';
const perPage = 15;
let currentPage = 1;
const loadBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-input');
let searchTerm = null;
const imgContainer = document.getElementById('images');
const lightBox = document.querySelector('.lightbox');
const closeBtn = document.querySelector('.uil-times');
const downloadBtn = document.querySelector('.uil-import');


const downloadImg = (imgUrl) => {
    fetch(imgUrl)
        .then(res => res.blob())
        .then(file => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file)
            a.download = new Date().getTime;
            a.click();
        }).catch(() => alert('Failed to download image'))
}

const displayLightBox = (name, photo, original) => {
    lightBox.querySelector('img').src = photo;
    lightBox.querySelector('span').innerText = name;
    lightBox.classList.add('show');
    downloadBtn.setAttribute('data-img', original)
    document.body.style.overflow = 'hidden';
}
const hideLightBox = () => {
    lightBox.classList.remove('show');
    document.body.style.overflow = 'auto';

}
displayData = (data) => {
    imgContainer.innerHTML = '';
    data.map(img => {
        const { src, alt, photographer } = img;
        const newLi = document.createElement('li');
        newLi.setAttribute('onclick', `displayLightBox('${photographer}','${src.large2x}','${src.original}')`);
        newLi.innerHTML = `
        <img src=${src.large2x} alt=${alt}>
        <div class="details">
        <div class="photographer">
        <i class="uil uil-camera"></i>
        <span>${photographer}</span>
        </div>
        <button onclick = "downloadImg('${src.original}');event.stopPropagation();">
        <i class="uil uil-import"></i>
        </button>
        </div>
        `
        newLi.setAttribute("class", 'card');
        imgContainer.appendChild(newLi);
    })
}
const getImages = apiUrl => {
    loadBtn.innerText = 'Loading...';
    loadBtn.classList.add('disabled');

    fetch(apiUrl, {
        headers: { Authorization: apiKey }
    })
        .then(res => res.json())
        .then(data => {
            displayData(data.photos)
            loadBtn.innerText = 'Load more';
            loadBtn.classList.remove('disabled');
        })
        .catch(() => alert('Failed to load images'))

}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)


const loadMoreImages = () => {
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    getImages(apiUrl);
}

const loadSearchImages = (e) => {
    if (e.key === '') return searchTerm = null;
    if (e.key === 'Enter') {
        currentPage = 1;
        searchTerm = e.target.value;
        imgContainer.innerHTML = '';
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}
loadBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightBox);
downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));