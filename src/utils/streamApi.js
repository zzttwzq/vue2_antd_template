// import EventSourcePolyfill from 'eventsource-polyfill';
// import { BROADCAST_TIPS } from "@/api/Api.js";

// /**
//  * 流式聊天请求函数
//  * @param {Object} params - 请求参数，应包含 messages 字段
//  * @returns {Promise<string>} - 返回一个 Promise，解析为完整的响应数据
//  */
// export const streamChat = (params) => {
//   return new Promise((resolve, reject) => {
//     // 从本地存储中获取用户令牌
//     let localToken = localStorage.getItem(process.env.VUE_APP_USER_TOKEN_KEY);
//     if (!localToken) {
//       localToken = "";
//     }
//     console.log('用户令牌:', localToken);

//     // 创建 EventSource 实例
//     const eventSource = new EventSourcePolyfill(
//       `${BROADCAST_TIPS}/chatStream?messages=${encodeURIComponent(JSON.stringify(params.messages))}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `${localToken}`
//         },
//         payload: {
//           model: "qwen-plus",
//           stream: true,  // 关键参数！启用流式
//           messages: params.messages
//         },
//         withCredentials: true
//       }
//     );

//     let fullResponse = '';

//     // 处理接收到的消息事件
//     eventSource.onmessage = (event) => {
//       console.log("收到数据:", event.data);
//       try {
//         const data = JSON.parse(event.data);
//         if (data.choices?.[0]?.delta?.content) {
//           fullResponse += data.choices[0].delta.content;
//           // 触发自定义事件（Vue 组件监听）
//           document.dispatchEvent(new CustomEvent('stream_update', {
//             detail: { chunk: data.choices[0].delta.content, full: fullResponse }
//           }));
//         }
//       } catch (parseError) {
//         console.error('解析服务器数据出错:', parseError);
//       }
//     };

//     // 处理错误事件
//     eventSource.onerror = (error) => {
//       console.error('EventSource 出错:', error);
//       eventSource.close();
//       reject(error);
//     };

//     // 处理完成事件
//     eventSource.onclose = () => {
//       console.log('流式数据接收完成');
//       eventSource.close();
//       resolve(fullResponse);
//     };
//   });
// };
