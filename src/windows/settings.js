window.register({
    id: 'settings',
    title: 'Settings',
    items: [
        {
            type: 'file',
            title: 'Reset',
            action: () => {
                PageState.reset()
                document.location.reload()
            },
        },
    ],
    itemsSort: (a, b) => a.type < b.type, // folder first
})
