// The volume meter function is credit to Huooo;
// Copyright (c) 2022 by Huooo (https://codepen.io/huooo/pen/LBKPZp)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function beginDetect() {
	let mystatus = document.getElementById('status')
	let audioContext = new (window.AudioContext || window.webkitAudioContext)()
	let mediaStreamSource = null
	let scriptProcessor = null
  
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// 获取用户的 media 信息
		navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
		// 将麦克风的声音输入这个对象
		mediaStreamSource = audioContext.createMediaStreamSource(stream) 
		// 创建一个音频分析对象，采样的缓冲区大小为4096，输入和输出都是单声道
		scriptProcessor = audioContext.createScriptProcessor(4096,1,1) 
		// 将该分析对象与麦克风音频进行连接
		mediaStreamSource.connect(scriptProcessor) 
		// 此举无甚效果，仅仅是因为解决 Chrome 自身的 bug
		scriptProcessor.connect(audioContext.destination)
  
		// 开始处理音频
		scriptProcessor.onaudioprocess = function(e) {
			// 获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
			let buffer = e.inputBuffer.getChannelData(0)
			// 获取缓冲区中最大的音量值
			let maxVal = Math.max.apply(Math, buffer)

			//when the volume reach a range, warning
			if(maxVal>.5){
				mystatus.innerHTML = 'Volume:' + Math.round(maxVal * 100)+" Too Loud! Warning!";
				//change color of the volume meter if the sound is too loud;
				mystatus.style.color = "red";
			}else{
				mystatus.innerHTML = 'Volume:' + Math.round(maxVal * 100);
				mystatus.style.color = "black";
			}

		};
	  }).catch((error) => {
		mystatus.innerHTML = 'Error' + error
	  })
	} else {
	  mystatus.innerHTML = 'Fail to Access Audio'
	}
  }