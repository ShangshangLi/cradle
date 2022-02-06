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
        // 显示音量值
        mystatus.innerHTML = 'Volume:' + Math.round(maxVal * 100);
      };
    }).catch((error) => {
      mystatus.innerHTML = 'Error' + error
    })
  } else {
    mystatus.innerHTML = 'Fail to Access Audio'
  }
}