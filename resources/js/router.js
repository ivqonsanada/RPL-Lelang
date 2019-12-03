import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Search from './pages/Search';
import ShopDetail from './pages/ShopDetail';
import AddAddress from './pages/AddAddress';
import ItemDetails from './pages/ItemDetails';
import LandingPage from './pages/LandingPage';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import CreateShop from './pages/CreateShop';
import CreateLelang from './pages/CreateLelang';


const Router = () => (
    <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path='/itemDetails' component={ItemDetails} />
        <Route path='/checkout' component={Checkout} />
        <Route path='/search' component={Search} />
        <Route path='/shop' component={ShopDetail} />
        <Route path='/tambahAlamat' component={AddAddress} />
        <Route path='/register' component={Register} />
        <Route path='/profile' component={UserProfile} />
        <Route path='/createShop' component={CreateShop} />
        <Route path='/createLelang' component={CreateLelang} />
    </Switch>
)

export default Router;
