function autocomplete(address, latitude, longitude) {
    if(!address) return; // skip function if an address wasn't provided on the page
    // console.log(address, latitude, longitude);
    const dropdown = new google.maps.places.Autocomplete(address);

    dropdown.addListener('place_changed', () => {
        const place = dropdown.getPlace();
        // console.log(place);
        latitude.value  = place.geometry.location.lat();
        longitude.value = place.geometry.location.lng();
    });

    //if user hits enter on address field, don't submit form
    address.on('keydown', (e) => {
        if(e.keyCode === 13) e.preventDefault();
    });
}

export default autocomplete;