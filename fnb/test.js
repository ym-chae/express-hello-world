

function sendNativeAction(serviceName, functionName, params) {
    fnbBridge.sh.exec(success, fail, serviceName, functionName, params);
}
function success(data, params) {
    
}
function fail(data, params) {
    
}
function callbackListener(result) {
    
}
function callbackAppEvent(message) {
    alert("app event = " + JSON.stringify(message));
}
/* script handler  */
//////////////////////////////////////////////////////////////////////////
fnbBridge = {};
fnbBridge.sh = {};

/**
 * 네이티브로 실행할 함수의 콜백 아이디
 */
fnbBridge.sh.callbackID = Math.floor(Math.random()*2000000000);

/**
 * 실행한 함수가 콜백을 실행하기 전까지, 콜백 저장
 */
fnbBridge.sh.callbacks = {};

/**
 * 디바이스 체크
 */
fnbBridge.sh.isMobile = {
android: function () {
    return navigator.userAgent.match(/Android/i) == null ? false : true;
},
ios: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
},
any: function () {
    return (this.android() || this.ios())
}
};

/**
 * web -> android / ios 실행
 */
fnbBridge.sh.exec = function(successCallback, failCallback, className, command, params){
    console.log("[fnbBridge.sh.exec =========== start]");
    if (!fnbBridge.sh.isMobile.any()) {
        console.log("[fnbBridge.sh.exec =========== 웹에서 실행할 수 없습니다. ]");
        //fail.call(this,"웹에서 실행할 수 없습니다.");
        //return;
    }
    
    // callbacks
    var callbackID = null;
    if(successCallback || failCallback){
        callbackID = fnbBridge.sh.callbackID;
        fnbBridge.sh.callbackID += 1;
        fnbBridge.sh.callbacks[callbackID] = {className:className, command:command, success:successCallback, fail:failCallback, params: params}
    }
    
    try {
        
        if(fnbBridge.sh.isMobile.android() ){
            console.log("[fnbBridge.sh.exec ===========]", "android");
            fnbBridge.sh.aosCommand(callbackID, className, command, params);
        }else if(fnbBridge.sh.isMobile.ios() ){
            console.log("[fnbBridge.sh.exec ===========]", "ios");
            fnbBridge.sh.iosCommand(callbackID, className, command, params);
        }else{
            console.log("[fnbBridge.sh.exec ===========]", "웹화면");
            
            //TODO test web callback
            var strCallbackID = callbackID.toString();
            var message = {
                "callbackID": strCallbackID,
                "command": command,
                "params": params
            };
            var args = {};
            
            console.log(" fnbBridge.sh.exec ::::: message : " + JSON.stringify(message, null, 4) );
            var webMessage = Object.assign({}, message)
            webMessage.className = className
            requestPrinter(webMessage)
            var strArgs = JSON.stringify(message);
            var strMessage = JSON.stringify(message);
            fnbBridge.sh.command_callback(callbackID, true, strArgs, strMessage);

            
        }
        
    } catch (e) {
        console.log("fnbBridge.sh.exec Error: " + e);
    }
};

/**
 *  AOS WebView에 Javascript Interface 실행하여 명령 전송
 */
fnbBridge.sh.aosCommand = function(callbackID, className, command, params){
    var strCallbackID = callbackID.toString();
    var message = {
        "callbackID": strCallbackID,
        "className": className,
        "command": command,
        "params": params
    };
    
    console.log(" fnbBridge.sh.aosCommand ::::: message : " + JSON.stringify(message, null, 4) );
    window.nativeInterface.execute( JSON.stringify(message) );

    requestPrinter(message)
};

/**
 *  IOS WKWebView에 스크립트메세지 전송
 */
fnbBridge.sh.iosCommand = function(callbackID, className, command, params){
    var strCallbackID = callbackID.toString();
    var message = {
        "requestId": strCallbackID,
        "serviceName": className,
        "action": command,
        "params": params
    };
    var request = document.getElementById("request")
    request.value = JSON.stringify(message, null, 4)
    console.log(" fnbBridge.sh.iosCommand ::::: message : " + JSON.stringify(message, null, 4) );
    window.webkit.messageHandlers.ssgcommerce.postMessage( JSON.stringify(message) );

    requestPrinter(message)
};

var rsaKey = "356AA68F5A50D5EA9024CC33B772F573A768ABA6CDBB941E74B0C1B2A91A5A9BAB1666288D58EF7708884673FA26F5729461CB40B59BECD612122345D28E1A4368D442FB9DC2A0D84E6408BF47777E5195B1487745D2DC9F159CCE15E905503E274E7D8D3422CF9BE33211AD29FE87B6E40E2D9E321E596BD66B94CDC0A5C26B613A5186458FC8869674DA14279EA66E4A0BAE5DFEBBED0BD9475A0EF73085E2EEC557C7926E56D9A1890265538476AB9638F88930030D0D9A715CA9C6FA831998866729FE78166CB83FBD07B4F949B2B4D2CB91E5946965477D18516EBFAD4A24EA7637530EA8862A483011B8132656064D2B63DE94C57F127AAECD43F2352F";

//////////////////////////////////////////////////////////////////////////


// 신세계 fnb 테스트 함수 - sss

// 푸시알림 설정값 전달.  true: 푸시 동작. false: 푸시 방지
var pushState = false
function setPushstate(value) {
    var params = {
        "value" : value
    };
    sendNativeAction("Push", "state", params)

    // 테스트용 플래그 토글
    pushState = !value
}

// 네이티브 뒤로가기 (물리, 제스처) 기능 방지 설정. true: 뒤로가기 방지. false: 뒤로가기 동작.
var historybackFlag = false
function preventHistoryBack(value) {
    var params = {
        "value" : value
    };
    sendNativeAction("Control", "historyback", params)

    // 테스트용 플래그 토글
    historybackFlag =!value
}

// Data , set 은 값 저장. Data, get 은 값 조회. Data, delete 는 값 삭제
function dataStorageSet() {
    var params = {
        "name": "refreshToken",
        "value" : "asfd8sfhf298hf89323w9h9wf98jsf"
    };
    sendNativeAction("Data", "set", params)
}

function dataStorageGet() {
  var params = {
      "name" : "refreshToken"
  };
  sendNativeAction("Data", "get", params)
}

function dataStorageDel() {
  var params = {
      "name" : "refreshToken"
  };
  sendNativeAction("Data", "delete", params)
}


function dataStorageGetCpcd() {
  var params = {
      "name" : "cpcd"
  };
  sendNativeAction("Data", "get", params)
}

function moveBack() {
    requestPrinter({name: 'moveBack'})
}



// 신세계 fnb 테스트 함수 - eeee


















function goPrevPageWithData() {
    var params = {
        "data" : "test data"
    };
    sendNativeAction("Navigator", "goPrevPageWithData", params)
}

function generateBarcode() {
    var params = {
        "code" : "777100083303423291"
    };
    sendNativeAction("Create", "barcode", params)
}

function loginApple() {
    var params = {
        "type" : "apple"
    };
    sendNativeAction("Login", "loginSNS", params)
}

function loginKakao() {
    var params = {
        "type" : "kakao"
    };
    sendNativeAction("Login", "loginSNS", params)
}

function loginFacebook() {
    var params = {
        "type" : "facebook"
    };
    sendNativeAction("Login", "loginSNS", params)
}

function loginPayco() {
    var params = {
        "type" : "payco"
    };
    sendNativeAction("Login", "loginSNS", params)
}

function logOut() {
    var params = { };
    sendNativeAction("LogOut", "logout", params)
}


function callbackListener(message) {
    var response = document.getElementById("response")
    response.value = JSON.stringify(message, null, 4)
}

function requestPrinter (message) {
    var request = document.getElementById('request')
    request.value = JSON.stringify(message, null, 4)
}

////////////////////////////////////////////////////////////////////////////////
