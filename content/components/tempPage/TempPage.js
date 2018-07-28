import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import PropTypes from 'prop-types';

const columns = [
    {
        dataField: 'id',
        text: 'Request #'
    },
    {
        dataField: 'requestId',
        text: 'HTTP Request ID'
    }, 
    {
        dataField: 'initiator',
        text: 'Initiator'
    },
    {
        dataField: 'timeStamp',
        text: 'Time Stamp'
    }, 
    {
        dataField: 'type',
        text: 'Type'
    }, 
    {
        dataField: 'url',
        text: 'URL'
    }, 
    {
        dataField: 'statusCode',
        text: 'HTTP Response Code'
    }, 
    {
        dataField: 'statusLine',
        text: 'HTTP Response'
    }
];

function indication() {
    return 'Table is Empty'
}

const NoDataIndication = () => (
    <div className="spinner">
        <div className="rect1" />
        <div className="rect2" />
        <div className="rect3" />
        <div className="rect4" />
        <div className="rect5" />
    </div>
);

const Table = ({ data, page, sizePerPage, onTableChange, totalSize }) => (
    <div>
        <BootstrapTable
            remote
            keyField="id"
            data={ data }
            columns={ columns }
            pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
            overlay={ overlayFactory({ spinner: true, background: 'rgba(192,192,192,0.3)' }) }
            onTableChange={ onTableChange }
            noDataIndication={ () => <NoDataIndication /> }
        />
    </div>
);

class TempPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            loading: true,
            sizePerPage: 10,
            totalSize: 100
        };
    }

    handleTableChange = (type, { page, sizePerPage }) => {
        const currentIndex = (page - 1) * sizePerPage;
        setTimeout(() => {
        this.setState(() => ({
            page,
            sizePerPage,
            loading: false,
        }));
        }, 10);
        this.setState(() => ({ data: [] }));
    }
    render() {
        const CaptionElement = () => <h1 style={{ borderRadius: '0.25em', textAlign: 'center', color: 'rgb(36, 48, 64)', border: '1px solid #fa9728', padding: '0.5em' }}>Temp Page</h1>;

        
        const { sizePerPage, page, loading, totalSize } = this.state;

        return (            
            <div>
                <BootstrapTable 
                    remote

                    keyField="id" 
                    data={ [] } 
                    // data={ data }
                    caption={<CaptionElement />} 
                    columns={ columns } 
                    //noDataIndication={ indication }
                    noDataIndication={ () => <NoDataIndication /> } 
                    
                    loading={ loading }
                    
                    pagination={ paginationFactory({ page, sizePerPage, totalSize }) }
                    overlay={ overlayFactory({ spinner: true, background: 'rgba(192,192,192,0.3)' }) }
                    
                    onTableChange={ this.handleTableChange }
                />
            </div>
        );
    }
}

Table.propTypes = {
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    onTableChange: PropTypes.func.isRequired
};

export default TempPage;