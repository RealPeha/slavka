module.exports = {
    id: 'mine',
    title: 'Minecraft',
    items: [
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
    ],
    itemsSort: (a, b) => a.type < b.type, // folder first
}
