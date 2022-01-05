import { useContext, useState, useEffect } from "react"
import { Context } from '../../context';
import { NavigatorContext } from '../../context/Navigator';
import SideNav, { NavItem, NavIcon } from '@trendmicro/react-sidenav';
import { useLocation } from 'react-router-dom';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';


const SideNavBar = () => {

  const { state } = useContext(Context)
  const { navigator, navigatorDispatch } = useContext(NavigatorContext)
  const [selectedState, setSelectedState] = useState("chat")
  const location = useLocation();


  return (
    <div>
      {(state.email || state.username) && (location.pathname === "/chatting") && (
        <SideNav onSelect={(selected) => {
          console.log(selected)
          setSelectedState(selected)
          navigatorDispatch({
            type: "CHANGE",
            payload: selected
          })
        }} style={{ backgroundColor: "#2e2e2e", position: "relative", height: "90vh", zIndex: "1", overflowX: "hidden", width: "5%", display: "" }}>
          <SideNav.Nav defaultSelected="chat">
            <NavItem eventKey="profile" style={{}}>
              <NavIcon>
                <div className="pt-2" style={selectedState === "profile" ? { color: "green" } : {}}>
                  <ion-icon name="contact" style={{ fontSize: '25px' }}></ion-icon>
                </div>
              </NavIcon>
            </NavItem>
            <NavItem eventKey="chat" style={{ marginTop: "20px", marginBottom: "20px" }}>
              <NavIcon>
                <div className="pt-2" style={selectedState === "chat" ? { color: "green" } : {}}>
                  <ion-icon name="chatbubbles" style={{ fontSize: '25px' }}></ion-icon>
                </div>
              </NavIcon>
            </NavItem>
            <NavItem eventKey="friendRequests" style={{ marginTop: "20px", marginBottom: "20px" }}>
              <NavIcon>
                <div className="" style={selectedState === "friendRequests" ? { color: "green" } : {}}>
                  <i class="bi bi-person-plus-fill" style={{ fontSize: '25px' }}></i>
                </div>
              </NavIcon>
            </NavItem>
            <NavItem eventKey="friends" style={{ marginTop: "20px", marginBottom: "20px" }}>
              <NavIcon>
                <div className="pt-2" style={selectedState === "friends" ? { color: "green" } : {}}>
                  <ion-icon name="people" style={{ fontSize: '29px' }}></ion-icon>
                </div>
              </NavIcon>
            </NavItem>
            <NavItem eventKey="others" style={{ marginTop: "20px", marginBottom: "20px" }}>
              <NavIcon>
                <div className="" style={selectedState === "others" ? { color: "green" } : {}}>
                  <i class="bi bi-search" style={{ fontSize: '21px' }}></i>
                </div>
              </NavIcon>
            </NavItem>
          </SideNav.Nav>
        </SideNav>
      )}
      
    </div>
  )
}

export default SideNavBar