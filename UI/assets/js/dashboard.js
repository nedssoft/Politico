
let click = 1;
const dashNavToggle = document.getElementById('dash__nav__toggle');
const navLateral = document.getElementById("sidebar__menu");
const navbar = document.getElementById("nabvar");
const main = document.getElementById("main");
dashNavToggle.addEventListener('click', () =>{
	if(click ==  1){
    navLateral.style.display    = "none";
    navbar.style.width          = "100%";
    navbar.style.left           = "0";
    main.style.width            = "100%";
    click = click + 1;
   } 
   else {
      navLateral.style.display  = "block";
      navbar.style.width        = "82%";
      navbar.style.left         = "18%";
      main.style.width          = "82%";
      click = 1;
   }

});