import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Register from './components/Register'
import Navigator from "./components/Navigator"
import Login from "./components/Login"
import Chatting from "./components/Chatting"
import Logout from "./components/Logout";
import Error from "./components/Error"
import './App.css'
import { Provider } from './context';
import { NavigatorProvider } from './context/Navigator';
import { SocketProvider } from './context/socket'
import SideNavBar from './components/SideNavbar/SideNavBar'


const App = () => {


  return (
    <Provider>
      <NavigatorProvider>
        <SocketProvider>
          <BrowserRouter>
            <Navigator />
            <div style={{ display: "flex" }}>
              <SideNavBar />
              <Switch> {/* by switch we can handle err page */}
                <Route exact path='/'><Home /></Route>
                <Route exact path='/register'><Register /></Route>
                <Route exact path='/login'><Login /></Route>
                <Route exact path='/chatting'><Chatting /></Route>
                <Route exact path='/logout'><Logout /></Route>
                <Route><Error /></Route> {/* Error Page */}
              </Switch>
            </div>
          </BrowserRouter>
        </SocketProvider>
      </NavigatorProvider>
    </Provider>
  )
}

export default App