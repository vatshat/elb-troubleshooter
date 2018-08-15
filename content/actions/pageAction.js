export const pageChangeAction = (currentPageProps, sizePerPageProps) => ({
    type: 'PAGE_CHANGE',
    currentTablePage: currentPageProps,
    sizePerTablePage: sizePerPageProps
})

export const pageTempChangeAction = (currentPageProps) => ({
    type: 'TEMP_PAGE_CHANGE',
    currentTempTablePage: currentPageProps
})

export const pageSizeTempChangeAction = (sizePerPageProps) => ({
    type: 'TEMP_PAGE_SIZE_CHANGE',
    sizePerTempTablePage: sizePerPageProps
})

export const captureToggleAction = (captureToggleProps) => ({
    type: 'CAPTURE_TOGGLE',
    captureToggle: captureToggleProps
})