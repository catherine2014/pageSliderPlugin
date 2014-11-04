
PageSlider 组件的开发文档说明
====================================

##组件的结构

#### 1.  Util 类

Util是一个dom操作的部分，这部分由于之前没有确认移动端要不要用jquery所以这里的函数主要是在jquery的方法外包了一层，用于扩展。

#### 2. PageSlider 类

PageSlider类是这个组件的主类，里面包含了这个组件的主要方法。

具体方法的介绍，如有需要的，我已经注释在代码中了。

这里大概介绍：

>**参数列表**
>-  el: 传入包裹页面的dom 元素
>- aniType:  页面的切换效果（由SwitchAniType 继承而来的各种切换方式，这里目前只写了SlideType）
>- direction: 页面的切换方向（vertical, horicontal）
>- duringTime: 切换动画所需要的时间
>- callback： 在切换动画结束后，其他操作由回调函数传入

**属性&方法介绍**

_aniTypeList:

-  如果要自定义切换效果，需要在这里注册

_init：

- 1）初始化必要的属性
- 2）给pages添加类名
- 3）根据传入的切换效果参数初始化，this._aniType = new (this._aniTypeList[opts.aniType])(this);
- 4）初始化touch 事件

_moveEndCallback:

- 1）作为touch事件的end callback 
- 2）根据page的切换方向调用 switchTo方法

_aniCallback: 

-  1）为相应的page移除和添加actived类
-  2）如果用户传入callback参数，也是在这里调用的

switchTo:

-  **（公开方法）传入切换页面的index即可切换，可用于其他用户自定义的切换按钮**
-  调用切换类的切换方法switchToAni

>**note:** PageSlider类是可以相互嵌套的，举例来说，可以再上下切换的页面中嵌套水平切换的另一个pageSlider实例。


**使用方法**

```
var page = new PageSlider({
        el: pageWrapper,
        aniType:'slide',
        direction: 'vertical',
        duringTime: 800,
        callback: function(cur, target){
            //this is the pageSlider instance
            var index = this.curIndex;
            $('#menu li').eq(index).click();
        }
    });
```

####3. SwitchAniType类

所有页面的切换效果类都必须继承它

**方法介绍**

init:
- 子类需要覆盖的方法
- 初始化页面的初始样式

initAttributes:

- 定义必要属性

switchToAni:
- 子类需要覆盖的方法
- 定义切面的切换动画效果

> **tips:** 具体的子类复写方法可以参考SlideType类

#### 4. TouchEvents类

这个类定义touch 事件，并不是为了pageSlider定制的，所有的touch事件都可以使用

>**参数介绍**
>- el: 绑定touch事件的dom 元素
>- callbacks：startCB, moveCB, endCB 分别为touch start, move ,end 的回调函数
>- threshold:  定义水平和垂直方向偏移量


**方法介绍**

_init:

- 初始化变量绑定事件

_bindEvents：

- 事件绑定函数

_start, _move:

- touch start 和touch move 事件调用的函数

_end:

- touch end事件调用的函数
- 只是将isChgX, isChgY, delta传给endCB，让用户自定义 

**使用方法**

```
var  touchEvents = new TouchEvents({
                    el:  touchEl,
                    callbacks: {
		                startCB: null,
	                    moveCB: null,
	                    endCB: null
	                }
	            });
```


##PS:
> PageSlider现在还很不完善，实现思路方面还有待改进，但作为js组件库的第一个实例，仅作抛砖引玉之用，期待能够启发大家对于js组件库的实现架构的思考。
