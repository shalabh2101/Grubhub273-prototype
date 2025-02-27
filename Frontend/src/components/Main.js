import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Signupbuyer from './Signupbuyer/Signupbuyer';
import Signinbuyer from './Signinbuyer/Signinbuyer';
import Buyerhome from './Buyerhome/Buyerhome';
import Userprofile from './Userprofile/Userprofile';
import Search from './Search/Search';
import Restaurent from './Restaurent/Restaurent';
import Signinowner from './Signinowner/Signinowner';
import Signupowner from './Signupowner/Signupowner';
import Ownerprofile from './Ownerprofile/Ownerprofile';
import Mainpage from './Mainpage/Mainpage';
import Ownerhome from './Ownerhome/Ownerhome';
import Pastorderpage from './Pastorderpage/Pastorderpage';
import RestaurentMenu from './RestaurentMenu/RestaurentMenu';
import Upcomingorderpage from './Upcomingorderpage/Upcomingorderpage';

//Create a Main Component
class Main extends Component {
    render(){
        return( 
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/signupbuyer"  exact component={Signupbuyer}/>
                <Route path="/signinbuyer" exact component={Signinbuyer}/>
                <Route path="/"  exact component={Mainpage}/>
                <Route path="/buyerhome"  exact component={Buyerhome}/>
                <Route path ="/userprofile" exact component={Userprofile}/>
                <Route path="/search/:food" exact component ={Search}/>
                <Route path="/restaurent/:id" exact component ={Restaurent}/>
                <Route path="/signinowner" exact component ={Signinowner}/>
                <Route path="/signupowner" exact component ={Signupowner}/>
                <Route path="/ownerhome/:email" exact component ={Ownerhome}/>
                <Route path="/ownerprofile/:email1" exact component ={Ownerprofile}/>
                <Route path="/pastorder" exact component ={Pastorderpage}/>
                <Route path="/restaurentmenu" exact component ={RestaurentMenu}/>
                <Route path="/upcomingorder" exact component ={Upcomingorderpage}/>
    
    
            </div>
        )
    }
}
//Export The Main Component
export default Main;