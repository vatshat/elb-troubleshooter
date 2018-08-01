export const pageChangeAction = (currentPageProps, sizePerPageProps) => ({
    type: 'PAGE_CHANGE',
    currentTablePage: currentPageProps,
    sizePerTablePage: sizePerPageProps
})