import React, { Component } from "react";
import "../../App.css";
import { Button, Dialog, Toast } from "antd-mobile";
import { checkQrCode, getLink, getToken } from "../../utils/api";
import QRCode from "qrcode.react";

class AddUser extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      showPopup: false,
      img: "你还未获取登录链接",
      link: "",
      timer: null, // 添加 timer 属性
      check: null, // 添加 check 属性
      showExpiration: false // 添加 showExpiration 属性
    };
  }
  
  componentWillUnmount() {
    if (this.state.check !== undefined) {
      clearInterval(this.state.check);
    }
    clearTimeout(this.state.timer);
  }
  isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );
  };

  isWechat = () => {
    if (/MicroMessenger/i.test(window.navigator.userAgent)) {
      return "inline";
    } else {
      return "none";
    }
  };

  click = async () => {
    let data = await getLink();
    this.setState({
      img: data.url,
      link: data.code,
      showPopup: true,
      showExpiration: false, // 重置 showExpiration 状态
    });
    let timer = setTimeout(() => {
      this.setState({ showExpiration: true });
    }, 5 * 60 * 1000);
    this.setState({ timer });

    let check = setInterval(async () => {
      let resp = await checkQrCode(data.code);
      if (resp.success) {
        clearInterval(check);
        console.log("登录成功");
        console.log(resp.data);

        let token = await getToken(resp.data.split("=")[1], data.sign);
        console.log(token);
        if (token.success) {
          Toast.show(
            "登录成功\n该软件为免费软件，若你正在付费使用，请速度举报管理员"
          );
          this.setState({
            link: "",
          });
        }
      }
    }, 5000);

    this.setState({
      check: check,
    });

    setTimeout(() => {
      clearInterval(check);
    }, 1000 * 300);

    /* let element = document.createElement("a");
    element.href =
      "dtxuexi://appclient/page/study_feeds?url=" + escape(data.url);
  element.click();*/
  };

  redirectToApp = async () => {
    console.log(this.isMobile());
    if (this.isMobile()) {
      let element = document.createElement("a");
      element.href =
        "dtxuexi://appclient/page/study_feeds?url=" + escape(this.state.img);
      element.click();
    }
  };

  hidePopup = () => {
    clearInterval(this.state.check); // 清除计时器
    clearTimeout(this.state.timer);
    this.setState({ showPopup: false ,
    check: null,
    timer: null, // 重置计时器引用
    showExpiration: false, // 重置 showExpiration 状态
  });
  };

  render() {
    return (
      <div>
        <div style={{ width: "100%", height: "50%" }}>
          <h2 style={{ margin: 10, color: "red", display: this.isWechat() }}>
            当前环境为微信环境，请点击右上角在浏览器中打开
          </h2>
          <button
            onClick={this.click}
            style={{ marginTop: 10 }}
            className="myButton"
          >
            点击登录
          </button>
          {/*<span>{this.state.link}</span>//生成一个二维码id*/}
          {this.state.showPopup && (
            <div id="hcmpopup-container" className="show">
              <div id="hcmpopup" className="show">
                <span className="close" onClick={this.hidePopup}>
                  &times;
                </span>
                {/*<h2>扫描二维码登录</h2>*/}
                <div className="xxlogo___3gfKF">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAABACAMAAADGU96YAAADKGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMUFCODEwM0M5MDAxMUU4QTM5RkU5MERFOTc1RTBGOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowMUFCODEwNEM5MDAxMUU4QTM5RkU5MERFOTc1RTBGOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxQUI4MTAxQzkwMDExRThBMzlGRTkwREU5NzVFMEY4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxQUI4MTAyQzkwMDExRThBMzlGRTkwREU5NzVFMEY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dGSU6wAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABCUExURUdw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"/>
                </div>
                <div className="qrcode">
                  <QRCode
                    id="qrCode"
                    value={this.state.img}
                    size={250} // 二维码的大小
                    fgColor="#000000" // 二维码的颜色
                    style={{
                      margin: "auto",
                      display:
                        this.state.img === "你还未获取登录链接"
                          ? "none"
                          : "block",
                    }}
                    imageSettings={{
                      src: "data:image/png;base64,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", // 二维码中间的logo图片
                      height: 35,
                      width: 35,
                      excavate: true, // 中间图片所在的位置是否镂空
                    }}
                  />
                </div>
                {!this.isMobile() && (
                  <div className="nomobil">
                    <span>
                      注意：检测到当前浏览器为电脑浏览器，当前模式下只支持扫码登录
                    </span>
                  </div>
                )}
                {this.isMobile() && (
                  <button onClick={this.redirectToApp} className="myButton1">
                    点击跳转手机应用
                  </button>
                )}
                {this.state.showExpiration && (
                  <div className="overlay">
                    <div className="refresh-button" onClick={this.click}>
                    <svg viewBox="64 64 896 896" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
                      <path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 0 1 755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 0 1 512.1 856a342.24 342.24 0 0 1-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 0 0-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 0 0-8-8.2z">
                        </path>
                    </svg>
                    </div>
                    <div className="expiration-text">二维码已过期，点击刷新</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AddUser;
