
PageSlider ����Ŀ����ĵ�˵��
====================================

##����Ľṹ

#### 1.  Util ��

Util��һ��dom�����Ĳ��֣��ⲿ������֮ǰû��ȷ���ƶ���Ҫ��Ҫ��jquery��������ĺ�����Ҫ����jquery�ķ��������һ�㣬������չ��

#### 2. PageSlider ��

PageSlider���������������࣬�������������������Ҫ������

���巽���Ľ��ܣ�������Ҫ�ģ����Ѿ�ע���ڴ������ˡ�

�����Ž��ܣ�

>**�����б�**
>-  el: �������ҳ���dom Ԫ��
>- aniType:  ҳ����л�Ч������SwitchAniType �̳ж����ĸ����л���ʽ������Ŀǰֻд��SlideType��
>- direction: ҳ����л�����vertical, horicontal��
>- duringTime: �л���������Ҫ��ʱ��
>- callback�� ���л��������������������ɻص���������

**����&��������**

_aniTypeList:

-  ���Ҫ�Զ����л�Ч������Ҫ������ע��

_init��

- 1����ʼ����Ҫ������
- 2����pages�������
- 3�����ݴ�����л�Ч��������ʼ����this._aniType = new (this._aniTypeList[opts.aniType])(this);
- 4����ʼ��touch �¼�

_moveEndCallback:

- 1����Ϊtouch�¼���end callback 
- 2������page���л�������� switchTo����

_aniCallback: 

-  1��Ϊ��Ӧ��page�Ƴ������actived��
-  2������û�����callback������Ҳ����������õ�

switchTo:

-  **�����������������л�ҳ���index�����л��������������û��Զ�����л���ť**
-  �����л�����л�����switchToAni

>**note:** PageSlider���ǿ����໥Ƕ�׵ģ�������˵�������������л���ҳ����Ƕ��ˮƽ�л�����һ��pageSliderʵ����


**ʹ�÷���**

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

####3. SwitchAniType��

����ҳ����л�Ч���඼����̳���

**��������**

init:
- ������Ҫ���ǵķ���
- ��ʼ��ҳ��ĳ�ʼ��ʽ

initAttributes:

- �����Ҫ����

switchToAni:
- ������Ҫ���ǵķ���
- ����������л�����Ч��

> **tips:** ��������ิд�������Բο�SlideType��

#### 4. TouchEvents��

����ඨ��touch �¼���������Ϊ��pageSlider���Ƶģ����е�touch�¼�������ʹ��

>**��������**
>- el: ��touch�¼���dom Ԫ��
>- callbacks��startCB, moveCB, endCB �ֱ�Ϊtouch start, move ,end �Ļص�����
>- threshold:  ����ˮƽ�ʹ�ֱ����ƫ����


**��������**

_init:

- ��ʼ���������¼�

_bindEvents��

- �¼��󶨺���

_start, _move:

- touch start ��touch move �¼����õĺ���

_end:

- touch end�¼����õĺ���
- ֻ�ǽ�isChgX, isChgY, delta����endCB�����û��Զ��� 

**ʹ�÷���**

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
> PageSlider���ڻ��ܲ����ƣ�ʵ��˼·���滹�д��Ľ�������Ϊjs�����ĵ�һ��ʵ����������ש����֮�ã��ڴ��ܹ�������Ҷ���js������ʵ�ּܹ���˼����
