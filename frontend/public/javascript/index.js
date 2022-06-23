function toggleNav() {
    let nav_links = document.getElementById("nav_links");
    if (nav_links.style.height == "0px") {
        nav_links.style.height = "80px";
        nav_links.style.marginTop = "20px"
    } else {
        nav_links.style.height = "0px";
        nav_links.style.marginTop = "0px"
    }

    
}