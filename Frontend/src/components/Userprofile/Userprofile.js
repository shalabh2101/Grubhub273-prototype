import React, {Component} from 'react';
import axios from 'axios';
import { Redirect ,Link, NavLink} from 'react-router-dom'


class Userprofile extends Component{

   //constructor
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
 this.state = {
                email: "",
                password:"",
                phonenumber:"",
                name:"",
                errormessege:false,
                messegevalue:"",
                update:"",
                result:"",
                type:"buyer"
  }
    

 this.passwordChangeHandler=this.passwordChangeHandler.bind(this);
 this.phonenumberChangeHandler=this.phonenumberChangeHandler.bind(this);
 this.nameChangeHandler=this.nameChangeHandler.bind(this);

        }

phonenumberChangeHandler=(e)=>{
            this.setState ({   
                   phonenumber: e.target.value
           })
           }

nameChangeHandler=(e)=>{
            this.setState ({   
                   name: e.target.value
           })
           }

passwordChangeHandler=(e)=>{
    this.setState ({ 
            password: e.target.value
   })
   }

componentDidMount=()=>{

    console.log("Inside the component did mount")
    const data={
        email:this.props.emailfromstore,
        type:this.state.type
    }
    //console.log("this is email",data.email)
    //console.log(this.props.emailfromstore)
    axios.defaults.withCredentials = true;
    
    axios.post('http://ec2-3-130-96-6.us-east-2.compute.amazonaws.com/getdata', data)
    .then(response=>{
       console.log("response.data.name ",response.data.Name);
       console.log("response  ",response);
      
        if(response.status === 200 ){ //why 202 and why 200 please check
            this.setState({
                   name:response.data.Name,
                   email:response.data.Email,
                   phonenumber:response.data.Phonenumber,
                   password:response.data.Password
        })  
        }
        else {
            this.setState({
               errormessege:true,
               messegevalue:"User Data unabale to retrive due to DB connection issue"
          })  
       
        }
 })
    .catch(err=>{

        console.log('Search  exist in getting name:')
    console.log('err:', err)
    this.setState({
        searchcheck:2,
        errormessege:true
    })
    })

}

updateBuyerCheck=(e)=>{

    e.preventDefault();//
    const data = {
        name: this.state.name,
        email : this.state.email,
        phonenumber: this.state.phonenumber,
        password:this.state.password
        }
        console.log(data);

        axios.defaults.withCredentials = true;

        axios.post('http://ec2-3-130-96-6.us-east-2.compute.amazonaws.com/updatebuyer', data)
            .then(response => {
                console.log('response::', response);
                console.log("Status Code : ",response.status);
               // console.log('existssss:', this.exists)
                if(response.status === 200 ){
                    this.setState({
                        
                           
                            errormessege:false,
                            result:response.data,
                            update:true
                        


                })  
                const data=this.state.email;
              
                console.log("Correct  updation",response.body)
                }
                // if(response.status === 401 )
                else {
                    this.setState({
                                 errormessege:true,
                            result:response.data      

                })  
             //   const data=" AUTHENTICATION FAILED ";
               
                console.log(" update  failed",this.state)
                }
               
            }).catch(err => {
                console.log('error in update :')
                console.log('err:', err)
                this.setState({
                   
                    errormessege:true,
                    messegevalue:"Error in updating the page"
                })
            })

}


render(){
    
    return(
        <div>
           
            <br/>
                
                
              <nav class="navbar navbar-expand-lg navbar-dark primary-color">

                
                <NavLink to="/buyerhome"  exact activeStyle={ {color:'red'}}> <h2 style={{color: 'red',
                    marginTop: '0%',
                    marginLeft: '2%'}}>
                    GRUBHUB
                </h2></NavLink>

                </nav>

                <div className="container" style={{textAlign:'-webkit-center'}}> 
                <h3 style={{color: 'grey',
                    marginTop: '0%',
                    marginLeft: '2%'}}>
                    User Profile Page
                </h3>
                </div>

             <div>
                    
                </div>
               <div className="container" style={{textAlign:'-webkit-center'}}> 

               <div style={{width: '30%'}} >
                        <label >Name:{localStorage.getItem('name_buyer')}</label>
                    </div>
                    <br/>   
             
                <form  onSubmit= {this.updateBuyerCheck} >
                   
                    { this.state.errormessege ? 
                        <p>{this.state.messegevalue}</p> 
                        : null}

                    <div style={{width: '30%'}} className="form-group">
                        <input  onChange = {this.nameChangeHandler}  type="text" className="form-control" name="name" placeholder="Email" value={this.state.name}></input>
                    </div>
                    <br/>    
                

                    <div style={{width: '30%'}} className="form-group">
                        <input  onChange = {this.passwordChangeHandler}  type="text" className="form-control" name="password" placeholder="Password" value={this.state.password} ></input>
                    </div>

                    <div style={{width: '30%'}} className="form-group">
                        <input  onChange = {this.phonenumberChangeHandler}  type="text" className="form-control" name="password" placeholder="Password" value={this.state.phonenumber} ></input>
                    </div>
                    <br/>

                    <div style={{width: '30%'}}>
                        <button  className="btn btn-success"  type="submit">Update</button>
                    </div>
                    <br/> 
                
                    <br/> 

                    { this.state.update && <p>Data is successfully updated</p> }
         </form>
                {/* <div>
      <Buyerhome email={this.state.email} type={this.state.type}></Buyerhome>
      </div> */}
            </div>
        </div>
    )
}

}


export default Userprofile;