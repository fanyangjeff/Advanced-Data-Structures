window.onload = ()=>{
    setUpDropdownMenu();
}


function setUpDropdownMenu(){
    var dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {

        dropdown.onmouseover = function(){
            let menu = this.querySelector(".dropdown-menu");
            menu.classList.add("show");
        }

        dropdown.onmouseleave = function(){
            let menu = this.querySelector(".dropdown-menu");
            menu.classList.remove("show");
        }

    })
}
