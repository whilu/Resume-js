var charIndex = -1;//字符串索引
var stringLength = 0;//所有的字符串的长度
var inputText;//输入的字符串
var i=1;//根据内容选择相应的输出匹配字符串
var initString = "";//临时字符串
var timer1=0;//定时器1
var timer2=0;//定时器2
var currentStyle = 'inline';//光标等待输入
var initFlag=false;//初始化标志位，等待初始化完成以后才可以执行输入command操作
var tmpCmd="";//临时command存储
var delFlag=0;//删除时剩余字符的标志位
var conArr=null;//获取所有要输出的内容
var writeSpeed=60;//写命令的速度
var charIndexOne=-1;//单条写命令索引
var stringLengthOne = 0;//单条命令长度
var cmdStr=null;//单条命令


function toButtom(){
    //滚动条保持最底部
    window.scrollTo(0,document.body.scrollHeight);
}
//写内容
function writeContent(init){
    conArr = document.getElementById('currentCon').innerHTML.split("%");
    if(init){
    	inputText = document.getElementById('contentToWrite').innerHTML;
    }
    if(charIndex==-1){
        charIndex = 0;
        stringLength = inputText.length;
    }
    initString = document.getElementById('myContent').innerHTML;
	initString = initString.replace(/<SPAN.*$/gi,"");//根据正则表达式判断是否有<span>_</span>输出，如果则去掉
    
    var theChar = inputText.charAt(charIndex);
   	var nextFourChars = inputText.substr(charIndex,4);//判断是否到换行，截取4个字符
    // alert(nextFourChars);
   	if(nextFourChars=='<BR>' || nextFourChars=='<br>'){
   		theChar  = '<BR>'+conArr[i];
   		charIndex+=3;
        i=i+2;
    }
    initString = initString + theChar + "<SPAN id='blink'>_</SPAN>";//当前内容为原有内容加上下一个字符加上一个下划线
    document.getElementById('myContent').innerHTML = initString;
    charIndex = charIndex/1 +1;
    if(charIndex%2==1){
         document.getElementById('blink').style.display='none';
    }else{
         document.getElementById('blink').style.display='inline';
    }
            
    if(charIndex<=stringLength){
        timer1=setTimeout('writeContent(false)',writeSpeed);
    }else{
    	blinkSpan();
    }
    toButtom();
}
//初始化完成后以及输入command时光标的闪烁控制
function blinkSpan(){//所有内容输出完毕，光标闪动速度变慢
	if(currentStyle=='inline'){
	   currentStyle='none';
	}else{
	   currentStyle='inline';
	}
	document.getElementById('blink').style.display = currentStyle;
	timer2=setTimeout('blinkSpan()',500);
    initFlag=true;
}
//初始化完成后监听按键事件
document.onkeydown=function getKey(e){
    if (initFlag) {
        var resultStr="";
        var e = e || window.event; 
        var keyCode = e.keyCode || e.which || e.charCode;
        if(keyCode == 13 || keyCode == 108){
            if (tmpCmd.substr(0,2) == "ls") {
                //alert("cd");
                if (tmpCmd.length >= 4) {
                    var tmpCmdContext = tmpCmd.substr(3,tmpCmd.length-3);
                    for(var m = 0; m < conArr.length; m=m+2){
                        conArr[m]=conArr[m].replace(/\s+/g, "");//修正符g表示全局匹配
                        //alert(conArr[m]);
                        if(conArr[m]==tmpCmdContext){
                            resultStr=conArr[m+1];
                            resultStr=resultStr.substr(0,resultStr.length-7);
                            //alert(resultStr+"#");
                            break;
                        }
                    }
                    if(resultStr == ""){
                        for(var m = 0; m < conArr.length; m=m+2){
                            conArr[m]=conArr[m].replace(/\s+/g, "");//修正符g表示全局匹配
                            //alert(conArr[m]);
                            if(conArr[m]=="notfound"){
                                resultStr=conArr[m+1];
                                resultStr=resultStr.substr(0,resultStr.length);
                                // alert(resultStr);
                                break;
                            }
                        }
                    }
                }
                else{
                    resultStr="";
                }
            }
            else if(tmpCmd=="clear" || tmpCmd == "cle"){
                window.location.reload();
            }
            else if(tmpCmd=="help" || tmpCmd == "hel"){
                //alert(conArr[0]);
                for(var m = 0; m < conArr.length; m=m+2){
                    conArr[m]=conArr[m].replace(/\s+/g, "");//修正符g表示全局匹配
                    //alert(conArr[m]);
                    if(conArr[m]=="help"){
                        resultStr=conArr[m+1];
                        resultStr=resultStr.substr(0,resultStr.length-7);
                        //alert(resultStr+"#");
                        break;
                    }
                }
                //resultStr="help you help you";
            }
            else if(tmpCmd=="login" || tmpCmd == "log"){
                alert("login");
            }
            else if(tmpCmd == "tree" || tmpCmd == "tre"){
                //alert("tree");
                for(var m = 0; m < conArr.length; m=m+2){
                    conArr[m]=conArr[m].replace(/\s+/g, "");//修正符g表示全局匹配
                    //alert(conArr[m]);
                    if(conArr[m]=="tree"){
                        resultStr=conArr[m+1];
                        resultStr=resultStr.substr(0,resultStr.length-7);
                        //alert(resultStr+"#");
                        break;
                    }
                }
            }
            else if(tmpCmd!=""){
                for(var m = 0; m < conArr.length; m=m+2){
                    conArr[m]=conArr[m].replace(/\s+/g, "");
                    if(conArr[m]=="unknowcmd"){
                        resultStr=conArr[m+1];
                        resultStr=resultStr.substr(0,resultStr.length);
                        break;
                    }
                }
            }
            //alert(tmpCmd);
            if(resultStr!=""){
                initString = initString.replace(/<SPAN.*$/gi,"");
                initString = initString + "<br />"+resultStr;
                resultStr="";
            }
            else{
                initString = initString.replace(/<SPAN.*$/gi,"");
                initString = initString;
            }
            initString = initString + "<br />lujun# <SPAN id='blink'>_</SPAN>";
            document.getElementById('myContent').innerHTML = initString;
            blinkSpan();
            //alert(tmpCmd.length);
            tmpCmd="";
            delFlag=tmpCmd.length;

            toButtom();
        }
        else if(keyCode == 8){
            delFlag--;
            //alert(tmpCmd.length+"#"+delFlag);
            if(delFlag>=0){ 
                clearTimeout(timer2);
                initString = initString.replace(/<SPAN.*$/gi,"");
                initString=initString.substr(0,initString.length-1);
                tmpCmd = initString.substr(initString.length-delFlag,delFlag);
                //alert(tmpCmd);
                delFlag=tmpCmd.length;
                initString = initString + "<SPAN id='blink'>_</SPAN>";
                document.getElementById('myContent').innerHTML = initString;
                blinkSpan();
            }
            return false;
        }
        else{
            var keyChar=String.fromCharCode(keyCode).toLowerCase();
            if(keyChar && delFlag <= 50){ //如果按下任意键 
                //添加到command窗口中
                clearTimeout(timer2);
                tmpCmd += keyChar;
                //alert(initString.substr(initString.length-30));
                initString = initString.replace(/<SPAN.*$/gi,"");
                initString = initString +keyChar+"<SPAN id='blink'>_</SPAN>";
                document.getElementById('myContent').innerHTML = initString;
                blinkSpan();
                delFlag=tmpCmd.length;
            }
        }
    }
}
//单条命令JS写特效，
//@ cmdStr ,全局参数单条命令字符串
function writeCmd(){
    clearTimeout(timer2);
    if(charIndexOne==-1){
        charIndexOne = 0;
        stringLengthOne = cmdStr.length;
    }
    initString = document.getElementById('myContent').innerHTML;
    initString = initString.replace(/<SPAN.*$/gi,"");
    
    var theChar = cmdStr.charAt(charIndexOne);
    var nextFourChars = cmdStr.substr(charIndexOne,4);//判断是否到换行，截取4个字符
    // alert(charIndexOne);
    if(nextFourChars=='<BR>' || nextFourChars=='<br>'){
        theChar  = '<BR>';
        charIndexOne+=3;
    }
    
    initString = initString + theChar + "<SPAN id='blink'>_</SPAN>";
    document.getElementById('myContent').innerHTML = initString;
    charIndexOne = charIndexOne/1 +1;
    if(charIndexOne%2==1){
         document.getElementById('blink').style.display='none';
    }else{
         document.getElementById('blink').style.display='inline';
    }
            
    if(charIndexOne<=stringLengthOne){
        //alert(charIndexOne);
        setTimeout('writeCmd()',writeSpeed);
    }else{
        showHD();
        charIndexOne=-1;
        stringLengthOne=0;
        cmdStr=null;
    }
}
function show(url){//单条命令展示
    cmdStr=url;
    writeCmd();
}
function showHD(){//展示
    initString = initString.replace(/<SPAN.*$/gi,"");
    for(var m = 0; m < conArr.length; m=m+2){
        conArr[m]=conArr[m].replace(/\s+/g, "");
        var tmpURL;
        switch(cmdStr){
            case "readme":
                tmpURL="readme";
                break;
            case "images/myPic.jpg":
                tmpURL="images/myPic.jpg";
                break;
            default:
                break;
        }
        //alert(tmpURL+"#"+conArr[m]);
        if(conArr[m]==tmpURL){
            resultStr=conArr[m+1];
            resultStr=resultStr.substr(0,resultStr.length);
            break;
        }
    }
    initString = initString + "<br />" +resultStr + "<SPAN id='blink'>_</SPAN>";
    document.getElementById('myContent').innerHTML = initString;
    blinkSpan();
    toButtom();
}