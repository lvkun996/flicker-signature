# flicker-signature
更好用的电子签名库，适配桌面端与移动端

## 下载

```
npm i flicker-signature
```

## 使用

基于原生js，适用任何js场景

### vue

```vue
<template>
	<div>
      <canvas id="myCanvas" ></canvas>
      <button @click="cancelStrokes" > cancelStrokes </button>
    </div>

</template>
<script>
    import FlickerSignature from 'flicker-signature'
	export default {
        data () {
            return {
                fs: null
            }
        },
        mounted () {
            this.initCanvas()
        },
        methods: {
            initCanvas () {
                this.fs = new FlickerSignature(
                	document.getElementById('myCanvas'),
           			{
                    	backgroundImg: 'grid'
                  	}
                )
            },
            cancelStrokes () {
                this.fs.cancelStrokes()
            }
        }
    }
</script>
```

### react

```react
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import FlickerSignature from 'flicker-signature'

const App = () => {
   
   const canvasRef = useRef(null)
  	
   useLayoutEffect(() => {
    new FlickerSignature(
      canvasRef.current!,
      {
        backgroundImg: 'grid'
      }
    )
  }, [])
   
   return (
        <div className="App">
          <canvas id='myCanvas' ref={canvasRef} ></canvas>
        </div>
  	);
}
```



## API

flicker-signature的第一个参数是你的canvas节点

第二个参数是配置项

### Props（参数）

| 参数          | 说明                                                         | 类型   | 默认值 |
| ------------- | ------------------------------------------------------------ | ------ | ------ |
| lineWidth     | 线条的宽度                                                   | number | 2      |
| lineColor     | 线条颜色                                                     | string | #000   |
| backgroundImg | 背景颜色，传入grid是白色网格，white是白色背景，可自定义传入图片链接当做背景 | string | "grid" |

### Fn (flicker-signature实例函数)

| 函数名         | 说明           | 参数           | 参数说明                                                     | 类型               | 默认值 |
| -------------- | -------------- | -------------- | ------------------------------------------------------------ | ------------------ | ------ |
| cancelStrokes  | 撤销绘制       | 一次撤销的步数 | string \|number                                              | string \| number   | 1      |
| recoverStrokes | 恢复绘制       | 一次恢复的步数 | string \| number                                             | string \| number   | 1      |
| toBase64       | 导出base64     | type           | base64头部，不传默认是image/png                              | string \|undefined | 无     |
|                |                | quality        | 质量0-1                                                      | number             | 1      |
| toBlob         | 导出blob流数据 | type           | [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 类型，指定图片格式，默认格式（未指定或不支持）为 `image/png`。 | DomString          | 无     |
|                |                | quality        | 质量0-1                                                      | number             | 1      |

## 最后

若对您提供了帮助，请作者喝杯咖啡吧~

![](./assets/wecaht.jpg)![](./assets/zhifubao.jpg)
