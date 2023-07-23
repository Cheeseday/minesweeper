const root = document.querySelector(':root');

function chooseColorTheme() {
    let theme = localStorage.getItem('theme');
    if(!theme || theme === 'light') {
        root.classList.add('light');
        localStorage.setItem('theme', 'light');
    } else if(theme === 'dark') {
        root.classList.add('dark');
    }
}

function changeColorTheme() {
    const theme = localStorage.getItem('theme');
    if(!theme || theme === 'light') {
        root.classList.add('dark');
        root.classList.remove('light');
        localStorage.setItem('theme', 'dark');
    } else if(theme === 'dark') {
        root.classList.add('light');
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

export { changeColorTheme, chooseColorTheme }; 