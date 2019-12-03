
require('./bootstrap');

import React, { PureComponent, createContext, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link, withRouter } from 'react-router-dom';
import { Layout, Menu, AutoComplete, Input, Button, Icon, Popover, Divider } from 'antd';
import FormLoginComponent from './components/FormLogin';
import ReactModal from 'react-modal';
import Router from './router'
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import './app.css';
import ButtonGroup from 'antd/lib/button/button-group';


import UserProvider, { UserContext } from './contexts/UserProvider';
export const AppContext = createContext();

function App() {
    return (
        <UserProvider>
            <UserContext.Consumer>
                {(context) => <AppChildren context={context} />}
            </UserContext.Consumer>
        </UserProvider>
    );
}

class AppChildren extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            success: true,
            trigger: () => {
                this.setState({ success: !this.state.success });
            },
            visible: false,
            getData: true,
            username: undefined,
            dataSource: []
        };
        this.props.context.checkLogin();
    }

    handleSearch = (value) => {
        this.setState({
            dataSource: !value ? [] : [
                value
            ],
        });
    }

    async componentDidMount() {
        const token = localStorage.token;
        const data = await axios.get('/api/pengguna', { headers: { Authorization: token } });
        this.setState({
            username: data.data.data.username,
            getData: false,
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    logOut = () => {
        localStorage.clear();
        window.location.replace('/');
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleOk = (e) => {
        //login process here
        this.setState({
            visible: false,
        });
    }

    popOver() {
        return (
            <Fragment>
                <Link to='/profile'>
                    <div>
                        {'Profil'}
                    </div>
                </Link>
                <Link to='/createLelang'>
                    <div>
                        {'Lelang Barang'}
                    </div>
                </Link>
                <Divider style={{ margin: '12px 0px 12px 0px' }} />
                <Link onClick={this.logOut}>
                    {'Keluar akun'}
                </Link>
            </Fragment>
        )
    }

    renderButton() {
        // console.log(this.props.context);
        if (this.props.context.loggedIn) {
            return (
                <ButtonGroup style={{ float: 'right' }}>
                    <Popover placement="bottomRight" content={this.popOver()} title={`Halo, ${this.state.username}`} trigger="hover">
                        <Button loading={this.state.getData}>
                            {this.state.username}
                        </Button>
                    </Popover>
                </ButtonGroup>
            );
        }
        return (
            <ButtonGroup style={{ float: 'right' }}>
                <Button onClick={this.showModal}>
                    {'Masuk'}
                </Button>
                <Button type="primary" style={{ fontWeight: 'bold' }}>
                    <Link to="/register">Daftar</Link>
                </Button>
            </ButtonGroup>
        )
    }

    render() {
        // console.log('render');
        if (this.state.toDashboard === true) {
            return <Redirect to='/dashboard' />
        }

        return (
            <AppContext.Provider value={this.state}>
                <BrowserRouter>
                    <Layout>
                        <Layout.Header style={{ backgroundColor: 'white', boxShadow: "rgba(0, 0, 0, 0.12) 0px 2px 8px 0px" }} id="pembagiMenu" >
                            <Link to='/'>
                                <div className="logo" >
                                    <img src="/LelangInCropped.png" width="100%" />
                                </div>
                            </Link>

                            <Menu
                                theme={'light'}
                                mode={'horizontal'}
                                style={{ lineHeight: '64px' }}
                            >
                                <Menu.Item>
                                    {/* <div className="certain-category-search-wrapper"> */}
                                    <AutoComplete
                                        className="certain-category-search"
                                        dropdownClassName="certain-category-search-dropdown"
                                        dropdownMatchSelectWidth={false}
                                        dropdownStyle={{ width: 300 }}
                                        size="large"
                                        style={{ width: '50vw' }}
                                        dataSource={this.state.dataSource}
                                        placeholder="Cari barang ..."
                                        optionLabelProp="value"
                                        onSearch={this.handleSearch}
                                        onSelect={(value) => { window.location.href = "/search?keyword=" + value }}
                                    >
                                        <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                                    </AutoComplete>
                                    {/* </div> */}
                                </Menu.Item>
                                {this.renderButton()}
                            </Menu>

                        </Layout.Header>

                        <ReactModal
                            isOpen={this.state.visible}
                            contentLabel="Login"
                            shouldFocusAfterRender={true}
                            shouldCloseOnOverlayClick={false}
                            shouldCloseOnEsc={true}
                            shouldReturnFocusAfterClose={true}
                            onRequestClose={this.handleCancel}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0,0,0,0.7)'
                                },
                                content: {
                                    borderRadius: '8px',
                                    bottom: 'auto',
                                    minHeight: '10rem',
                                    left: '50%',
                                    paddingTop: '0.4rem',
                                    paddingLeft: '2rem',
                                    paddingBottom: '2rem',
                                    paddingRight: '2rem',
                                    position: 'fixed',
                                    right: 'auto',
                                    top: '50%',
                                    transform: 'translate(-50%,-50%)',
                                    minWidth: '20rem',
                                    width: '30%',
                                    maxWidth: '30rem'
                                }
                            }}
                        >
                            <a onClick={this.handleCancel} style={{ marginLeft: '100%' }}>
                                <Icon type="close-circle" style={{ fontSize: 25 }} />
                            </a>
                            <FormLoginComponent />
                        </ReactModal>

                        <Layout.Content style={{ padding: '0 40px', marginTop: 40, 'minHeight': '81.5vh' }}>
                            <Router />
                        </Layout.Content>
                        <Layout.Footer style={{ textAlign: 'center' }}>
                            {'Developed by Kelompok 3'}
                        </Layout.Footer>
                    </Layout>
                </BrowserRouter>
            </AppContext.Provider>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
