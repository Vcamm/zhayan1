/**
 * 萌新工具。
 */


 //将url字符串转换为对象：
 function praseToObj(str){
       var start=str.indexOf("?")+1;
       var newStr=str.slice(start);
       var parts=newStr.split("&");
       var obj={};
       //循环遍历数组里的字符串元素，按照=分开，前面是名称，后面是值，然后循环添加到空对象中。
       for(var i=0;i<parts.length;i++){
           var arr=parts[i].split("=");//没有等号不会分开，有等号才分开，后面分开的才用等号链接还原等号，没分开的则不会被等号链接。
           //将第一个元素删除以后保存到names中，将剩下的字符串按照=链接，防止原来的字符串中包含=
           var names=arr.shift();//返回删除那个值。
           var values=arr.join("=");
           //用方括号添加属性名，属性值。
           obj[names]=values;
       }
       return obj;
 }


 //返回包含两端的随机数
 function selectFrom(lowerValue,upperValue){
         var choices=upperValue-lowerValue+1;
         return Math.floor(Math.random()*choices+lowerValue);
 }

//随机生成颜色，没啥卵用
function randomColor(){
      var r=selectFrom(0,255);
      var g=selectFrom(0,255);
      var b=selectFrom(0,255);
      return "rgb("+r+","+g+","+b+")";
}



 //数组去重
function noRepeatArr(repeatArr){
     var newArr=[];
     for(var i=0;i<repeatArr.length;i++){
         //判断元素第一次出现的下标是否是当前下标,如果不是当前下标，则代表不是第一次出现（前面出现过了）
         //indexof都是从开头开始找（原理）
         if(repeatArr.indexOf(repeatArr[i])==i){
             newArr.push(repeatArr[i]);
         }
     }
     return newArr;
}



//返回数组中最大的数
function findMax(arr){
    var maxValue=Math.max.apply(Math,arr);
    return maxValue;
}



//解决IE不支持document.getElementsByClassName的方法
function byClass(classname){
    //如果支持，就直接调用
    if(document.getElementsByClassName){
        return document.getElementsByClassName(classname);
    }
    var res=[];//定义数组保存结果；
    var elements=document.getElementsByTagName("*");//获取所有元素数组集合
    for(var i=0;i<elements.length;i++){
        var arr=elements[i].className.split(" ");//遍历访问每个元素的class属性，并按照空格拆分放入数组中
        for(var j=0;j<arr.length;j++){//遍历访问数组中取到元素的所有class属性值
            if(arr[j]===classname){//当前元素的class属性值中是否有与传入参数一致，一致就将当前元素push入结果数组中。
                res.push(elements[i]);
                break;//找到了就不用往后找了，class可以重复。
            }
           
        }
    }
    return res;
}


//简化元素选择代码，这也太懒了(￣▽￣)~*，简单模仿一下jQuery
function $(selector){
    if(selector.indexOf("#")===0){//说明是Id
        return document.getElementById(selector.slice(1));
    }
    if(selector.indexOf(".")===0){//说明是class
        return document.getElementsByClassName(selector.slice(1));//从第二个字符串开始截取。
    }
    return document.getElementsByTagName(selector);//其他情况按照标签名字查找
}


//解决IE事件监听里的兼容问题，addEventListener与attachEvent
function addOn(ele,type,callback){
    if(ele.addEventListener){
        if(type.indexOf("on")===0){//判断是否以on开头，addEventListener不以on开头，attach又要以on开头，很蛋疼。
            type=type.slice(2);
        }
        return ele.addEventListener(type,callback);
    }
    else{
        if(type.indexOf("on")!==0){
            type="on"+type;
        }
        return ele.attachEvent(type,callback);
    }
}

// 封装保存,查询cookie的函数。
// 参数为：键值对名与可选cookie属性（对象）
function cookie(key,value,obj){
    if(typeof value==="undefined"){
        var arr=document.cookie.split("; ");
        for(var i=0;i<arr.length;i++){
            var parts=arr[i].split("=");
            var name=decodeURIComponent(parts.shift());
            if(name===key){
                return decodeURIComponent(parts.join("="));
            }
        }
        return undefined;
    }
    var cookies=encodeURIComponent(key)+"="+encodeURIComponent(value);
    if(obj){
       obj=obj;
    }else{
        obj={};
    }
    if(obj.expires){
        var date=new Date();
        date.setDate(date.getDate()+obj.expires);
        cookies+=";expires="+date.toUTCString();
    }
    if(obj.path){
        cookies+=";path="+obj.path;
    }
    if(obj.domain){
        cookies+=";domain="+obj.domain;
    }
    if(obj.secure){
        cookies+=";secure";
    }
    document.cookie=cookies;
}
//封装获取css样式的函数，解决兼容问题
function css(ele,attrName){
    return window.getComputedStyle?getComputedStyle(ele)[attrName]:ele.currentStyle[attrName];
}
//封装简单的线性运动函数
/** 
 * 参数：需要添加动画的元素，各个变化属性的终值（对象），要求变化的时间，后续需要执行的函数（可实现线性执行动画等，可选）,计时器停止以后执行的函数。
*/
function animate(ele,obj,speed,fn){
    //每次执行函数之前先清除元素上已有的动画计时器，防止添加多个事件时的冲突
    //将计时器作为属性添加到元素上，每次清除传入这个属性参数就好
    clearInterval(ele.timer);
    //定义保存每个属性开始值与变化范围值的对象
    var start={};
    var range={};
    //通过for in 方法遍历传入的obj对象当中所有的属性，获得初始值并计算变化范围
    for(var attrName in obj){
        start[attrName]=parseFloat(css(ele,attrName));//转换为数字，方便计算
        range[attrName]=obj[attrName]-start[attrName];
    }
    //获取函数执行时的时间戳，开始时间
    var startTime=Date.now();
    //设置计时器属性(开始动画)
    ele.timer=setInterval(function(){
        //获取过程中的运动时间
        var endTime=Date.now();
        var rangeTime=endTime-startTime;
        //比较speed与rangeTime,取最小值，因为计时器运行时间可能超过speed，取speed就可以了
        var goTime=Math.min(rangeTime,speed);
        //遍历obj，为每个属性设置运动过程中css属性值
        for(var attrName in obj){
            //计算每个属性在运动中的属性值(位置)
            var result=goTime*(range[attrName]/speed)+start[attrName];
            ele.style[attrName]=result+(attrName==="opacity"?"":"px");//判断是否为透明度属性
        }
        //判断计时器是否停止，以及停止后是否执行后续函数
        if(goTime===speed){
            clearInterval(ele.timer);
            //判断是否有可选函数，以及是否执行可选函数
            //fn为true代表有fn参数，返回结果为true，还要继续执行后面的fn()
            if(fn){
                fn();
            }
        }

    },1000/60);
}
//淡入淡出函数的实现
/**
 * 参数：淡入淡出的元素，时间，后续执行的函数
 */
function fadeIn(ele,speed,fn){
    //设置如果没输入时间，就默认400
   speed=speed||400;
   //先把位置显示出来
   ele.style.display="block";
   //透明度设置为0
   ele.style.opacity=0;
   //再把透明度设置为慢慢变成1,淡入完毕才执行后续函数。
   animate(ele,{opacity:1},speed,fn);
}
function fadeOut(ele,speed,fn){
    //设置默认初始值
    speed=speed||400;
    //淡出
    animate(ele,{opacity:0},speed,function(){
        //淡出完毕，将位置隐藏
        ele.style.display="none";
        //有后续函数就执行后续函数，事件轮询机制，将要后续执行的函数写在里面
        if(fn){
            fn();
        }
    });
}