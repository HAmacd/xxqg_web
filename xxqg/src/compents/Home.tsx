import React, {Component} from "react";
import {Route, Routes} from "react-router-dom";
import AddUser from "./pages/AddUser";
import Users from "./pages/User";
import Other from "./Other";
import {NavBar, TabBar} from "antd-mobile";
import {MoreOutline, UserAddOutline, UserOutline} from "antd-mobile-icons";
import '../App.css';
import backImage from "./pages/background.png"

let tableItems = [
    {
        key: '/add_user',
        title: '添加',
        icon: <UserAddOutline />,
    },
    {
        key: '/user_manager',
        title: '用户',
        icon: <UserOutline />
    },
    {
        key: '/other',
        title: '更多',
        icon: <MoreOutline />
    },
]

class Home extends Component<any, any>{
    render() {
        return <>
           {/* <div style={{backgroundImage: `url(${backImage})`}}>*/}
  
           <div>
  <div className="xxnav-bar">
    <h3 className="xxheader">学而不思则罔</h3>
  </div>
  <div className="content">
  </div>
  {/*<div className="content"></div>*/}
    <Routes>
      <Route path={"add_user"} element={<AddUser navigate={this.props.navigate} location={this.props.location} />} />
      <Route path={"user_manager"} element={<Users level={sessionStorage.getItem("level")} navigate={this.props.navigate} location={this.props.location} />} />
      <Route path={"other"} element={<Other navigate={this.props.navigate} location={this.props.location} />} />
    </Routes><div className="shadowed-div" style={{position: "fixed", height: "60px", width: "100%", bottom: 0, zIndex: 9, color: "#f0f", backgroundColor: "#fff"}}>
    <TabBar activeKey={this.props.location.pathname} onChange={value => this.props.navigate("/home" + value)}>
      {tableItems.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar></div>
  </div>
        </>;
    }
}




export default Home
