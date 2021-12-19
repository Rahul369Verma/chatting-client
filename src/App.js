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
import { SearchProvider } from './context/searchItem';
import { SocketProvider } from './context/socket'


const App = () => {


  return (
    <Provider>
      <SearchProvider>
        <SocketProvider>
          <BrowserRouter>
            <Navigator />
            <Switch> {/* by switch we can handle err page */}
              <Route exact path='/'><Home /></Route>
              <Route exact path='/register'><Register /></Route>
              <Route exact path='/login'><Login /></Route>
              <Route exact path='/chatting'><Chatting /></Route>
              <Route exact path='/logout'><Logout /></Route>
              <Route><Error /></Route> {/* Error Page */}
            </Switch>
          </BrowserRouter>
        </SocketProvider>
      </SearchProvider>
    </Provider>
  )
}

export default App