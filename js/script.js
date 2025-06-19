const jsonFiles = [
    './json/furzena.json',
    './json/blue.json',
    './json/bella-li.json',
    './json/bevande.json'
];

var dataCache = jsonFiles.map(file =>
    fetch(file)
        .then(response => {
            if (!response.ok) console.log(`Error! Response status: ${response.status}`);
            return response.json();
        }).catch(error => {
            console.error(`Failed to load ${file}:`, error);
            return null;
        })
);

const dataPromise = Promise.all(dataCache);
const getData = async () => {
    try {
        const response = await dataPromise;
        return response;
    } catch (err) {
        console.error('Error getting promise');
        return [];
    }
};

const data = getData();

// funzioni ausiliarie
function clearMenu() {
    const container = document.getElementById("food-container");
    container.textContent = '';
}

function fillAll(data) {
    const menuList = ["furzena", "bluengreen", "bella-li", "bevande"];
    data.forEach((d, index) => 
        fillMenu(menuList[index],d)
    );
}

function fillMenu(btnId, data) {
    const container = document.getElementById("food-container");
    const menu = document.createElement("div");
    menu.className = "row menu"; // oggetto padre
    menu.id = "menu";

    const logo = document.createElement("div");
    logo.className = "row image-logo";
    logo.id = "image-logo";

    // gestione logo
    let img = document.createElement('img');
    img.src = `./img/ristoranti/logo_${btnId}.png`;
    img.className = 'ristorante';
    logo.appendChild(img);
    container.appendChild(logo);

    const titoletti = Object.keys(data[0]);
    titoletti.forEach((title) => {
        if (String(title) !== "other") {
            let h3 = document.createElement("h3");
            h3.className = "title"
            h3.textContent = String(title).charAt(0).toUpperCase() + title.slice(1);

            menu.appendChild(h3);
        }
        const items = data[0][title];
        if (Array.isArray(items)) {
            items.forEach((plate) => {
                let col8 = document.createElement("div"); 
                col8.className = "col-8";
                col8.innerHTML = 
                `
                    <p class="name">${plate.name}</p>
                    <small>${plate?.description || ''}</small>
                `
                let col4 = document.createElement("div"); 
                col4.className = "col-4";
                col4.innerHTML = `<p class="price">${plate.price}</p>`
                menu.appendChild(col8);
                menu.appendChild(col4);
            });
        } else if (typeof items === "string") {
            let div = document.createElement("div");
            div.className = "other col-12";
            let p = document.createElement("p"); 
            p.textContent = items;
            div.appendChild(p);
            menu.appendChild(div);
        }
    });

    container.appendChild(menu);
}

function handleClick(btnId) {
    clearMenu();
    const menuList = ["furzena", "bluengreen", "bella-li", "bevande"];
    data.then(data => {
        if (btnId === "generale") {
            fillAll(data);
        } else
            fillMenu(btnId, data[menuList.indexOf(btnId)])
        
    });
}

// main
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        let active = document.getElementsByClassName("btn active");
        active[0].className = active[0].className.replace("active", "");
        this.className = "btn active";
        handleClick(this.id);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    let generale = document.getElementById("generale");
    generale.className = "btn active";

    handleClick("generale");
});
