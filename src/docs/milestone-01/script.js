document.addEventListener('DOMContentLoaded', function() {
    //select all h2s
    const sectionHeaders = document.querySelectorAll('main section h2');

    sectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            //get the content container
            const container = this.parentElement.querySelector('.content-container');
            if (container) {
                container.classList.toggle('expanded');
            }
        });
    });
});



