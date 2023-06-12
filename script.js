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



/* this function retrieves the url and converts it into a downloadable file */
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

/* this function displays the lightbox */
/* at the same time sets name of the photographer and sends the original image link so that image quality doesn't get lowered after downloding */
const displayLightBox = (name, photo, original) => {
    lightBox.querySelector('img').src = photo;
    lightBox.querySelector('span').innerText = name;
    lightBox.classList.add('show');
    downloadBtn.setAttribute('data-img', original)
    /* hides the overflow while light box is visible */
    document.body.style.overflow = 'hidden';
}
/* this function hides the light box */
const hideLightBox = () => {
    lightBox.classList.remove('show');
    document.body.style.overflow = 'auto';
}
/* this function displays the images on the ui as a gallery */
displayData = (data) => {
    // every time this function is called the container gets refreshed
    imgContainer.innerHTML = '';
    /* maps through all the data it recieves from the get images function */
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
        `/* this is very important **stopPropagation()** */
        newLi.setAttribute("class", 'card');
        imgContainer.appendChild(newLi);
    })
}
/* this function fetches the image links and gets the data from the api */
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
/* calles the get images function */
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)

/* loads more images */
const loadMoreImages = () => {
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiUrl;
    //conditional rendering : if searched term exists the follow a specific link otherwise follow the usual one
    getImages(apiUrl);
}

/* loads images based on the search terms */
const loadSearchImages = (e) => {
    if (e.key === '') return searchTerm = null;
    if (e.key === 'Enter') {
        currentPage = 1;
        searchTerm = e.target.value;
        imgContainer.innerHTML = '';
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

/* buttons and click events */
loadBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightBox);
downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));