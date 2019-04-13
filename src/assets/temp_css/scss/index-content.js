const 
    sass = new Sass(),
    urls = [
        "temp_css/scss/headers.scss",
        "temp_css/scss/metrics.scss",
        "temp_css/scss/headers-capture-toggle.scss",
    ],
    scssStyles = document.createElement('style');

scssStyles.setAttribute("type", "text/css");

Promise.all(
    urls.map(
        url => fetch(url).then(resp => resp.text())
    )
).then(scssTexts => {
    scssTexts.forEach(scss => {
        sass.compile(scss, result => {
            scssStyles.insertAdjacentHTML('afterbegin', `${result.text} \n`);
    
            document.documentElement.firstChild.appendChild(scssStyles);
        });    
    });
});

    