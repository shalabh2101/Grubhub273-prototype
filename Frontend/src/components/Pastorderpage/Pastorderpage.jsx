import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link, NavLink } from 'react-router-dom'

import { Table, Menu, Icon, Button, Tab } from 'semantic-ui-react';
import { isNull } from 'util';



class Pastorderpage extends Component {
  //constructor

  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    var lunchquantity = [];

    this.state = {
      Orders:[],
      pastorder: []
    }

this.getitems=this.getitems.bind(this);

  }

  componentWillMount = () => {
    
    console.log("Inside the  Restaurent component did mount")
    const data = {
      id:localStorage.getItem('buyer_id'),
      type: 'd'
    }


    console.log("this is id", data.id)

    axios.defaults.withCredentials = true;

    axios.post('http://localhost:3001/getpastorders/', data)
      .then(response => {

        console.log("response  ", response);
        console.log(response.data)
        if (response.status === 200) {
           console.log("order fetched");
          if (isNull(response.data)) { console.log("breakfast is null") }
          this.setState({
           pastorder: response.data,
            
          })

         //setting partison length
         var i=0;
         var current=0;
         var Orders1=[];
        var temp=response.data;
         console.log("temp");
         console.log(temp);
         console.log(temp.length);


         //set length of the partitions
         while(temp.length>current+2)
         {
          Orders1[++i]= temp.slice(current,current+2);
          current=current+2;
         }
         Orders1[++i]=temp.slice(current,temp.length);

         this.setState(
           {
              Orders:Orders1,
              pastorder:Orders1[1]
           }
         )
         console.log("Orders1");
         console.log(Orders1);
        }
        
        else { console.log("something not right") }
      })
      .catch(err => {
        console.log('ordeer catch errrosr: 1')
        console.log('err:', err)
        this.setState({
          errormessege: true
        })
      });
  }




getitems=(item)=>
{
  console.log("checking get items items ",item);

return  item.map(element => {
 
  var tempitem=element.split(",")
  console.log("tempitem "+tempitem);

 return <Table.Row>
 <Table.Cell>
      Item name :{ tempitem[0]}
</Table.Cell>
<Table.Cell>
      Price :{ tempitem[1]  }
</Table.Cell>
<Table.Cell>
     Quantity :{ tempitem[2]  }
</Table.Cell>
</Table.Row>
});


}
 


  render() {

let Navlist;

if(this.state.Orders.length>0)
{  
  Navlist=Object.keys(this.state.Orders).map((key) =>(

      <button className="btn btn-success"  onClick={()=>this.setState({
        pastorder:this.state.Orders[key]
      })}>{key}</button>
    
  ))
  

}

    let orderlist;
    console.log(" Inside Render -this.state.pastorder ",this.state.pastorder)
if(this.state.pastorder !== "No data found")
{
  orderlist= <Table.Body>
            {/* add image too */}
            {/* <Table.Body>   */}
            {this.state.pastorder.map((pastorder) =>
           
 (  
 
 
    <Table.Row >
             
                
     </Table.Row>,
       <Table.Row>
       
              <Table.Cell><h3>{pastorder.resname}</h3></Table.Cell>
               
              <Table.Cell>{this.getitems(pastorder.orderitems)} </Table.Cell>
                <br></br>
         </Table.Row>),
            )}

          </Table.Body>
  
}

    return (
      <div>
        <br />
        

        
        {this.state.logout && <Redirect to='/signinbuyer' />}

        <nav class="navbar navbar-expand-lg navbar-dark primary-color">

<a class="navbar-brand" href="#" style ={{color:'red'}}>GRUBHUB</a>

</nav>

         <div className="container">
           
   <h2>Past Orders</h2>
         
{orderlist}

<br></br>
<br></br>

{Navlist}

  

          <br />

          <br />
        </div>
      </div>
    )
  }

}
export default Pastorderpage;



