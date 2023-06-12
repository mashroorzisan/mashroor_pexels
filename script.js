const apiKey = 'g7oLB8CfsYIeWJnJHg5jkYik1MiRZ7hgmPsrVCuPGGrj6dA3YntI6JOl';
const perPage = 15;
let currentPage = 1;
const loadBtn = document.querySelector('.load-more');

displayData = (data) => {
    const imgContainer = document.getElementById('images');
    imgContainer.innerHTML = '';
    console.log(data)
    data.forEach(img => {
        const { src, alt, photographer } = img;
        const newLi = document.createElement('li');
        newLi.innerHTML = `
        <img src=${src.large2x} alt=${alt}>
        <div class="details">
        <div class="photographer">
        <i class="uil uil-camera"></i>
        <span>${photographer}</span>
        </div>
        <button><i class="uil uil-import"></i></button>
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
        .then(data => displayData(data.photos))
    loadBtn.innerText = 'Load more';
    loadBtn.classList.remove('disabled');

}
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)


const loadMoreImages = () => {
    currentPage++;
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiUrl);
}

loadBtn.addEventListener('click', loadMoreImages)