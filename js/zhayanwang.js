//轮播图
var imgs=$(".banner-box")[0].childNodes;
for(var j = 0; j < imgs.length; j++)
{
    if(imgs[j].nodeType !== 1)
    {
     $(".banner-box")[0].removeChild(imgs[j]);
    } 
    //判断这种元素是否为元素节点,如果当前节点的nodeType不等于1，就会删除当前节点，否则保留， 元素节点:nodeType=1,属性节点:nodeTyp=2,文本节点:nodeType=3     
}
var len=imgs.length;