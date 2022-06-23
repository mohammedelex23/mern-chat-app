const toggleNav = () => {
    let nav_links = document.getElementById("nav_links");
    if (!nav_links.style.height) {
        nav_links.style.height = "auto";
    } else {
        nav_links.style.height = "";
    }
}

const hideNav = () => {
    let nav_links = document.getElementById("nav_links");
    nav_links.style.height = "";
}

export { toggleNav, hideNav };