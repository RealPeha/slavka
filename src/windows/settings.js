window.register({
    id: 'settings',
    title: 'Settings',
    items: [
        {
            type: 'file',
            title: 'Reset',
            icon: '/icons/reset.png',
            iconHover: '../icons/reset_selected.png',
            action: () => {
                PageState.reset()
                document.location.reload()
            },
        },
    ],
    itemsSort: (a, b) => a.type < b.type, // folder first
})
