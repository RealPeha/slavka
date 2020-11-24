module.exports = new Window('mine')
    .title('Minecraft')
    .items([
        {
            type: 'folder',
            title: 'Бесплатные моды для майнкрафта',
            windowId: 'test',
        },
        {
            type: 'file',
            title: 'Лучшая в мире игра',
            href: '/mine',
        },
    ], (a, b) => a.type < b.type)