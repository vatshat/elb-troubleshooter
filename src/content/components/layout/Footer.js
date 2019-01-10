import React from 'react';

const Footer = () => {
    const footerStyles = {
        paddingTop: '10px',
        position: 'fixed',
        left: 0,
        bottom: 0,
        background: 'white',
        width: '100%',
    };

    return (
        <footer style={ footerStyles }>
            <div className='row'>
                <div className='col-lg-2' />
                <div className='col-lg-10'>
                    <p>Copyright &copy; Add AWS copyright!!!!!!!!!!!!!!!!!!!</p>
                    <p><a href='https://www.getpostman.com/apps'>Also rather use Postman</a></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer