const keySplines = `keySplines="0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1;0 0.5 0.5 1`,
    other = `calcMode="spline" dur="1s" repeatCount="indefinite"`,
    keyTimes = `keyTimes="0;0.25;0.5;0.75;1"`,
    cXcY = `cx="16" cy="50" r="10"`
    
export const loadingSVG = (translateX, translateY) => {
    return `
        <svg class="svg-loading" width="${translateX}" height="${translateY}" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate( ${translateX/2}, ${translateY/2} )" >
                <circle ${cXcY} fill="#151d27">
                    <animate attributeName="r" values="10;0;0;0;0" ${keyTimes} ${keySplines}" ${other} begin="0s"></animate>
                    <animate attributeName="cx" values="84;84;84;84;84" ${keyTimes} ${keySplines}" ${other} begin="0s"></animate>
                </circle>
                <circle ${cXcY} fill="#2fa4e7">
                    <animate attributeName="r" values="0;10;10;10;0" ${keyTimes} ${keySplines}" ${other} begin="-0.5s"></animate>
                    <animate attributeName="cx" values="16;16;50;84;84" ${keyTimes} ${keySplines}" ${other} begin="-0.5s"></animate>
                </circle>
                <circle ${cXcY} fill="#cb4b16">
                    <animate attributeName="r" values="0;10;10;10;0" ${keyTimes} ${keySplines}" ${other} begin="-0.25s"></animate>
                    <animate attributeName="cx" values="16;16;50;84;84" ${keyTimes} ${keySplines}" ${other} begin="-0.25s"></animate>
                </circle>
                <circle ${cXcY} fill="#2fa4e7">
                    <animate attributeName="r" values="0;10;10;10;0" ${keyTimes} ${keySplines}" ${other} begin="0s"></animate>
                    <animate attributeName="cx" values="16;16;50;84;84" ${keyTimes} ${keySplines}" ${other} begin="0s"></animate>
                </circle>
                <circle ${cXcY} fill="#151d27">
                    <animate attributeName="r" values="0;0;10;10;10" ${keyTimes} ${keySplines}" ${other} begin="0s"></animate>
                    <animate attributeName="cx" values="16;16;16;50;84" ${keyTimes} ${keySplines}" ${other} begin="0s"></animate>
                </circle>
            </g>
        </svg>
    `
}