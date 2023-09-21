import './sass/aboutus.sass'

import Alert from '@mui/material/Alert';


const AboutUs = ( ) => {
      
      const services = [
            "Filing Cabinet - in development",
            "Social - assembling requirements",
            "Organizer - assembling requirements"
      ]

      function ListOfServices( props ){
            return <li> { props.service }</li>
      }

      function PageUnderDevelopmentNotice(  ){
            return( 
                
                <Alert variant="filled" severity="info" className='mb-3' >Page under development</Alert>   
                                
            );
      }
      

      return (
          <div id = "AboutUsPage">
            <PageUnderDevelopmentNotice />

                <h1>About Us</h1>

                <br/>

                <h3>1. Who are we you may ask ? </h3>

                <p>My name is Michael Nyakonu I am the owner of Jamii Developers. My company seeks to solve current Kenyan problems using information and technology. Jamii Developers is the Umbrella we fall under and we seek to grow by developing apps that interface with each other with the aid of creating more solutions.</p>

                <br/>

                <h3>2. What is a this "Single Sign-On" ? </h3>

                <p>The intial development of the project did not have a particular aim. So I the owner begun by ensuring we look for a method that allows all our users to access the various products with one single sign on. That way you my awesowe user only requires to login through one portal and for each app you add or install, you don't need to sign in more than once </p>

                <p>My hope is that in the future we will be able to introduce more security features like MFA, Biometrics to enhance your account's security plus make it easy</p>

                <p>TLDR: It works like Google's sign in </p>

                <h3>3. The App's Architecture? </h3>

                <p>As stated above we are going to be attempting to provide multiple solutions on this within each application you access think of it as its own service. A service at the time or writing this, is an application on its own. We are intertwining what we offer so you the user can easily jump between apps and still have access to the features we deem shareable </p>

                <h3>4. Services? What services are we offering </h3>

                <p> We will be updating our list of services as time goes on. Don't fret! We read your thoughts and try and improve or add on to our services. So far below are the services, we are currently working on.</p>

                <ul>
                  { services.map( (service) => <ListOfServices service={service} />)}
                </ul>



          </div>
    )
    
}
  
export default AboutUs