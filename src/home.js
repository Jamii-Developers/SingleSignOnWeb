import './sass/home.sass'
import logo from './logos/logo.png'


const Home = () => {
    return (
          <div className="jumbotron jumbotron-fluid row">
            <div id="jumbo-image" className="col-md-4">
                <img src={logo} alt="placeholder-image" width = "500px"/>
            </div>
            <div id="jumbo-intro" className="col-md-8">
                <h1>Blue Collar</h1>
                <h2>Share your portofolio with ease.</h2>
                <p>At Blue Collar we are here to help you showcase your work to your clients while we help you market yourself through us.</p>
            </div>
          </div>
    )
}
  
export default Home