let props = {
        margin : {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width: 1000,
        height: 600
    }

function extractSize() {
        const { margin, width: widthIncludingMargins, height: heightIncludingMargins } = props;
        const width = widthIncludingMargins - margin.left - margin.right;
        const height = heightIncludingMargins - margin.top - margin.bottom;
        
        return { width, height, margin };
    }
    
    const { width } = extractSize();    

    console.log(width)