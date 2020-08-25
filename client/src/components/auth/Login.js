import React, { Fragment,useState } from 'react'
import axios from 'axios'
import { Link, Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from "../../actions/auth";



 const Login = ({login, isAuthenticated}) => {

    const [formData, setFormData] = useState({

         email:'',
        password:'',
       
    });

    const {email,password} = formData;
    const onchange = e =>
        setFormData({
   ...formData, [e.target.name]:e.target.value
        });
     
   const onsubmit = async e=>{
      e.preventDefault();
      login(email,password);
    }

    if(isAuthenticated){
      return <Redirect to="/dashboard"/>
    }
return (
  <Fragment>
      
  
<h1 className="large text-primary">Sign In</h1>
<p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
<form className="form"onSubmit={e=>onsubmit(e)}>
  <div className="form-group">
    <input
      type="email"
      placeholder="Email Address"
      name="email"
     onChange = {e=>onchange(e)}
      value={email}
      
     
    />
  </div>
  <div className="form-group">
    <input
      type="password"
      placeholder="Password"
      value={password}
       onChange = {e=>onchange(e)}
      name="password"
    />
  </div>
  <input type="submit" className="btn btn-primary" value="Login" />
</form>
<p className="my-1">
  Don't have an account? <Link to="/register">Sign Up</Link>
</p>

  </Fragment>
)

 }

 Login.propTypes = {
  login:PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
const mapStateToProps = state =>({
  isAuthenticated: state.auth.isAuthenticated
 })
export default connect(mapStateToProps,{login})(Login);