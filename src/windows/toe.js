const dedent = require('dedent')

window.register({
    id: 'toe',
    title: 'Wantid',
    content: dedent`
        <h1>Да</h1>
        <p>Согласен</p>
    `,
    styles: {
        width: 'auto',
        height: 'auto',
    },
    features: {
        resizable: false,
        fullscreen: false,
        title: false,
        draggable: true,
    }
})
