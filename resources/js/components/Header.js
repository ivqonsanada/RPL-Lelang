import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends PureComponent {
    render() {
        return (
            <nav className='navbar navbar-expand-md navbar-light navbar-laravel'>
                <div className='container'>
                    <Link className='navbar-brand' to='/'>Tasksman</Link>
                </div>
            </nav>
        );
    }
}
