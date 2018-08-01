import React from 'react';

import { HeadersTableComponent, RefreshButtonComponent } from '../components/headers/HeadersPageComponent';

class HeadersTableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            totalSize: this.props.headersLength 
        };
    }
    
    handleTableChange (type, { page, sizePerPage }) {        
        window.pageChange(page, sizePerPage)        
    }

    handleTableRefresh () {
        this.setState(() => ({
            totalSize: this.props.headersLength
        }));
    }

    render() {        
        const { loading, totalSize } = this.state;
        const { sizePerPage, page } = this.props;
        window.pageChange = this.props.pageChange;

        return (
            <div>
                <RefreshButtonComponent 
                    handleTableRefresh = { this.handleTableRefresh.bind(this) }
                />
                
                <HeadersTableComponent 
                    data={ this.props.headersRowList }
                    page={ page }                    
                    sizePerPage={ sizePerPage }                    
                    totalSize={ totalSize }
                    loading={ loading }
                    onTableChange={ this.handleTableChange }
                />
            </div>
        );        
    }
}

export default HeadersTableContainer;