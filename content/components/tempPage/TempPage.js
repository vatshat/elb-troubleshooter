import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

const columns = [
    {
        dataField: 'id',
        text: 'Product ID'
    }, 
    {
        dataField: 'name',
        text: 'Product Name'
    }, 
    {
        dataField: 'price',
        text: 'Product Price'
    }
];
function indication() {
    return 'Table is Empty'
}

class TempPage extends React.Component {
    render() {
        const CaptionElement = () => <h1 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'rgb(36, 48, 64)', border: '1px solid #fa9728', padding: '0.5em' }}>Temp Page</h1>;

        return (            
            <div>
                <BootstrapTable keyField="id" data={ [] } caption={<CaptionElement />} columns={ columns } noDataIndication={ indication } />
            </div>
        );
    }
}

export default TempPage;