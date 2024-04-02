document.addEventListener("DOMContentLoaded", function() {
    //h2 in main section
    const mainH2 = document.querySelectorAll("main h2");

    // event listener for h2
    mainH2.forEach(h2 => {
        h2.addEventListener("click", function() {
            // make paragraph visible
            const paragraph = this.nextElementSibling;
            paragraph.classList.toggle("expanded");
        });
    });
});
