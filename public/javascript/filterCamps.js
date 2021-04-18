function filterCamps(title, location, maxPrice, minPrice, camps) {
    const generalTitles = filterByTitle(title, camps).general;
    const generalLocations = filterByLocation(location, camps).general;
    let topTitles = filterByTitle(title, camps).exact;
    let topLocations = filterByLocation(location, camps).exact;

    const allFilteredTitles = [...topTitles , ...generalTitles];
    const allFilteredLocations = [...topLocations , ...generalLocations];

    let results = allFilteredTitles.filter(obj => allFilteredLocations.includes(obj));
    results = results.filter(obj => filterByMaxPrice(maxPrice, camps).includes(obj));
    results = results.filter(obj => filterByMinPrice(minPrice, camps).includes(obj));

    topTitles = topTitles.filter(obj => results.includes(obj));
    topLocations = topLocations.filter(obj => results.includes(obj));

    return { results: results, topTitles: topTitles, topLocations: topLocations };

    console.log(results);
    console.log(topTitles);
    console.log(topLocations);

    // let firstOrderArr = filterByTitle(title, camps).exact;
    // let secondOrderArr = filterByLocation(location, camps).exact;
    // console.log(filterByTitle(title, camps));
    // console.log(filterByLocation(location, camps));
    // console.log(filterByMaxPrice(maxPrice, camps));
    // console.log(filterByMinPrice(minPrice, camps));
    // console.log(filterByMinPrice());
}

function filterByTitle(title, camps) {
    const filteredArr = [];
    const exactFilteredArr = [];
    let wordMatch = true;
    if (!title) {
        return {exact: [], general: camps};
    }
    for (let obj of camps) {
        let curTitle = obj.title.toLowerCase().split('');
        for (let char of title.split('')) {
            wordMatch = true;
            if(!curTitle.includes(char.toLowerCase())) {
                wordMatch = false;
                break
            }
            curTitle.splice(curTitle.indexOf(char), 1);
        }
        if(obj.title.toLowerCase().substr(0, title.length) === title.toLowerCase() && wordMatch){
            exactFilteredArr.push(obj);
            continue;
        }
        if(wordMatch) {
            filteredArr.push(obj);
        }
    }
    const filteredArrObject = {exact: exactFilteredArr, general: filteredArr};
    return filteredArrObject;
}

function filterByLocation(location, camps) {
    const filteredArr = [];
    const exactFilteredArr = [];
    let wordMatch = true;
    if (!location) {
        return {exact: [], general: camps};
    }
    for (let obj of camps) {
        let curTitle = obj.location.toLowerCase().split('');
        for (let char of location.split('')) {
            wordMatch = true;
            if(!curTitle.includes(char.toLowerCase())) {
                wordMatch = false;
                break
            }
            curTitle.splice(curTitle.indexOf(char), 1);
        }
        if(obj.location.toLowerCase().substr(0, location.length) === location.toLowerCase() && wordMatch){
            exactFilteredArr.push(obj);
            continue;
        }
        if(wordMatch) {
            filteredArr.push(obj);
        }
    }
    const filteredArrObject = {exact: exactFilteredArr, general: filteredArr};
    return filteredArrObject;
}



function filterByMaxPrice(price, camps) {
    const filteredArr = [];
    const campArr = [];
    if (!price) {
        return camps;
    }
    for (let obj of camps) {
        if(obj.price <= price) {
            filteredArr.push(obj);
        }
    }
    return filteredArr;
}

function filterByMinPrice(price, camps) {
    const filteredArr = [];
    const campArr = [];
    if (!price) {
        return camps;
    }
    for (let obj of camps) {
        if(obj.price >= price) {
            filteredArr.push(obj);
        }
    }
    return filteredArr;
}