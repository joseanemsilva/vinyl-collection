// Store the state of the filters and search, to be used in all functions
const state = {
    filter: {},
    search: "",
}

// Render the collection on the HTML page
const renderCollection = (itemData) => {
    return (`${itemData.filter((item) => filterAttribute(item) && filterName(item)).map(item => {
        return (
            `<article>
                <h2 class="vinyl-name">${item.album}</h2>
                <img class="vinyl-cover" src="assets/img/${item.cover}" alt="${item.album}">
                <div class=overlay>
                    <p class="vinyl-description">${item.description}</p>
                </div>
                <p class="vinyl-artist">${item.artist}</p>
                <p class="vinyl-year>${item.year}</p>
                <p class="vinyl-genre">${item.genre.join(", ")}</p>
            </article>`
        )
    }).join('')}`);

    function filterAttribute(item) {
        const { filter } = state;
        if (Array.isArray(item[filter.attribute])) {
            return item[filter.attribute].includes(filter.value)
        }
        return item[filter.attribute] == filter.value
    }

    function filterName(item) {
        return item.album.toLowerCase().includes(state.search.toLowerCase()); // Hoisting function
    }
}

// Setup description overlay for mouseover/mouseout effect
const setupOverlay = () => {
    const onHover = document.getElementsByTagName('article');

    for (const article of onHover) {
        article.addEventListener('mouseover', () => {
            const overlay = article.querySelector('.overlay');
            overlay.style.opacity = "1";
        });
        article.addEventListener('mouseout', () => {
            const overlay = article.querySelector('.overlay');
            overlay.style.opacity = "0";
        });
    }
}   

// Insert new HTML into the page
const rerender = (data) => {
    const newData = data.toSorted((a, b) => !b["album"].localeCompare(a["album"]));
    const renderedHtml = renderCollection(newData)
    const destination = 'main.collection'
    document.querySelector(destination).innerHTML = renderedHtml;
    
    setupOverlay();
}

// Generic header menu
const renderHeader = (values, htmlGenerator, destination) => {
    const renderedHtml = htmlGenerator(values);
    document.querySelector(destination).innerHTML = renderedHtml;
}

//Artist Menu
const getArtists = (data) => {
    return Array.from(new Set(data.map(item => item.artist).toSorted()));
} // generate the artist list based on the object data

const renderArtistsSection = itemData => {
    return "<h3> Artists </h3><hr>" + 
    (`${itemData.map(item => {
        return (
            `<li data-filter-value="${item}">${item}</li>`
        )
    }).join('')}`);
} // generate the HTML from the artist list

const renderArtists = (data) => {
    renderHeader(getArtists(data), renderArtistsSection, 'ul#artists');
} // render the artist list on the page

//Year Menu
const getYear = (data) => {
    return Array.from(new Set(data.map(item => item.year).toSorted()));
} // generate the year list based on the object data

const renderYearSection = itemData => {
    return "<h3> Year </h3><hr>" + 
    (`${itemData.map(item => {
        return (
            `<li data-filter-value="${item}">${item}</li>`
        )
    }).join('')}`);
} // generate the HTML from the year list

const renderYear = (data) => {
    renderHeader(getYear(data), renderYearSection, 'ul#year');
} // render the year list on the page

// Genre Menu
const getGenre = (data) => {
    return Array.from(new Set(data.map(item => item.genre).flat().toSorted()));
} // generate the genre list based on the object data

const renderGenreSection = itemData => {
    return "<h3> Genre </h3><hr>" + 
    (`${itemData.map(item => {
        return (
            `<li data-filter-value="${item}">${item}</li>`
        )
    }).join('')}`);
} // generate the HTML from the genre list

const renderGenre = (data) => {
    renderHeader(getGenre(data), renderGenreSection, 'ul#genre');
} // render the genre list on the page

// Sign up form validation
const signUpFormValidation = () => {
    document.getElementById("signup-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const nameRegex = /^[A-Za-z\s]{2,}$/;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!nameRegex.test(name) || !emailRegex.test(email)) {
            document.getElementById("error-message").style.display = "block";
        }
        else {
            document.getElementById("error-message").style.display = "none";
            alert("Sign up successful!");
        }
    });

    document.getElementById("name").addEventListener("focus", () => {
        document.getElementById("error-message").style.display = "none";
    });
    document.getElementById("email").addEventListener("focus", () => {
        document.getElementById("error-message").style.display = "none";
    });
}

// Calling Functions to render the headers menu
const renderHeaders = (data) => {
    renderArtists(data);
    renderYear(data);
    renderGenre(data);
}

// Call functions after the page is loaded so the collection can be dynamically generated 
window.onload = () => {
    fetch('assets/js/content.json')
    .then(response => response.json())
    .then(data => {
        renderHeaders(data.collection);
        rerender(data.collection);
        signUpFormValidation();
   })
};