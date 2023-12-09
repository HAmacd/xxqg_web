import React, {Component} from "react";
import {getAbout} from "../../utils/api";

class Help extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            about: ""
        };
    }

    componentDidMount() {
        getAbout().then((value)=>{
            this.setState({
                about:value.data

            })
        })

    }
    render() {
        return <>
            <h1 style={{color:"red",margin:10}}>如有任何疑问请联系管理员</h1><br/>
            <h2 style={{margin:10}}>主程序项目地址：<a href="https://github.com/sjkhsl/study_xxqg">https://github.com/sjkhsl/study_xxqg</a></h2>
            <h2 style={{margin:10}}>web程序项目地址：<a href="https://github.com/HAmacd/xxqg_web">https://github.com/HAmacd/xxqg_web</a></h2>
            <br/><h2 style={{margin:10}}>{this.state.about}</h2>
        </>
    }
}

export default Help
