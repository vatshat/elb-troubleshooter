import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import overlayFactory from 'react-bootstrap-table2-overlay';
import PropTypes from 'prop-types';

export class RefreshButtonComponent extends React.Component {
    
    render() {
        const { handleTableRefresh } = this.props;

        return (
            <button 
                type="button" 
                className="btn btn-default"
                onClick={handleTableRefresh} > 
                Refresh
            </button>

        );
    }
}
RefreshButtonComponent.propTypes = {
    handleTableRefresh: PropTypes.func.isRequired,
};

export class HeadersTableComponent extends React.Component {
    constructor(props){
        super(props);
    }    
    
    render() {
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

        const NoDataIndication = () => (
            <div className="spinner">
                <div className="rect1" />
                <div className="rect2" />
                <div className="rect3" />
                <div className="rect4" />
                <div className="rect5" />
            </div>
        );

        const CaptionStyle = {
            borderRadius: '0.25em',
            textAlign: 'center',
            color: 'rgb(36, 48, 64)',
            border: '1px solid #fa9728',
            padding: '0.5em'
        };

        const CaptionElement = () => <h1 style={CaptionStyle}>Temp Page</h1>;

        const { data, page, sizePerPage, onTableChange, totalSize, loading } = this.props;
        
        return (
            <div>
                <BootstrapTable
                    remote

                    keyField="id" 
                    data= { data }
                    caption={<CaptionElement />} 
                    columns={ columns } 
                    noDataIndication={ () => <NoDataIndication /> }                     
                    
                    page={ page }
                    loading={ loading }
                    sizePerPage={ sizePerPage }
                    totalSize={ totalSize }
                    onTableChange={ onTableChange }

                    pagination = {
                        paginationFactory({
                            page,
                            sizePerPage,
                            totalSize
                        })
                    }

                    overlay={ 
                        overlayFactory({ 
                            spinner: true, 
                            background: 'rgba(192,192,192,0.3)' 
                        }) 
                    }
                />
            </div>
        );
    }
}

HeadersTableComponent.propTypes = {
    data: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    onTableChange: PropTypes.func.isRequired,
};