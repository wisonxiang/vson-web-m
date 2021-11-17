<template>
  <div class="page-container">
    <van-form @submit="onSubmit" class="chat-info" v-if="infoFlag">
      <van-field
        v-model="name"
        name="昵称"
        label="昵称"
        placeholder="请输入昵称"
        :rules="[{ required: true, message: '请填聊天昵称' }]"
      />
      <van-field
        v-model="roomID"
        name="房间号"
        label="房间号"
        placeholder="房间号"
        :rules="[{ required: true, message: '请填写房间号' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
    <div class="chat-box" v-else>
      <div class="chat-online">在线人数{{ onlineNum }}</div>
      <div
        class="chat-item"
        :class="{ 'chat-me': item.me }"
        v-for="(item, idx) in chatList"
        :key="idx"
      >
        <div class="item=header">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-time">{{ item.time }}</span>
        </div>
        <div class="item-content">
          {{ item.content }}
        </div>
      </div>
              <van-button class="input-btn" type="primary" @click="leaveRoom"
          >离开</van-button>
      <div class="input-wrapper">
        <van-field v-model="msg" class="input-left" />
        <van-button class="input-btn" type="primary" @click="sendMsg"
          >输入</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Form, Field } from "vant";
export default {
  name: "Chat",
  data() {
    return {
      name: "11",
      roomID: "1",
      infoFlag: false,
      onlineNum: 0,
      msg: "",
      socket: null,
      chatList: [],
    };
  },
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
  },
  methods: {
    onSubmit() {
      this.infoFlag = false;
      this.startSocket();
    },
    startSocket() {
      const roomID = this.roomID;
      const userName = this.name;
      const uuid = getUuid();
      this.socket = io("/", { path: "/socket.io" });
      this.socket.on("connect", () => {
        console.log("连接成功");
      });
      this.socket.on("joined", (data) => {
        console.log("joined", data);
        this.onlineNum = data;
      });
      this.socket.on("leaved", (data) => {
        console.log("curent user", data);
      });
      this.socket.emit("join", { roomID, user: { name: userName, uuid } });
      this.socket.on("server message", (data) => {
        console.log('~~~~!');
        data.time = new Date().toLocaleTimeString();
        this.chatList.unshift(data);
      });

      this.socket.on('fulled',()=>{
        this.leaveRoom()
      })
    },
    sendMsg() {
      this.socket.emit("client message", { msg: this.msg });
      this.chatList.unshift({
        name: this.name,
        time: new Date().toLocaleTimeString(),
        me: true,
        content: this.msg,
      });
      this.msg = "";
    },
    leaveRoom(){
      this.socket.close();
    }
  },
  created() {
    this.onSubmit()
  },
  beforeDestroy(){


    this.leaveRoom()
  }
};
function getUuid() {
  let uuid = window.sessionStorage.getItem("uuid");
  if (uuid) return uuid;
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  uuid = s.join("");
  window.sessionStorage.setItem("uuid", uuid);
  return uuid;
}
</script>

<style lang="scss" scoped>
.page-container {
  .chat-info {
    margin-top: 200px;
  }
  .chat-box {
    width: 100%;
    height: calc(100vh - 150px);
    overflow-y: auto;
    padding: 0px 20px 50px 20px;
    box-sizing: border-box;
    margin: 50px 0 100px 0;
    .chat-online {
      position: fixed;
      top: 0;
      left: 100px;
    }
    .chat-item {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 20px;
      .item-name {
        margin-right: 20px;
        font-size: 16px;
      }
      .item-time {
        opacity: 0.8;
        font-size: 12px;
      }
      .item-content {
        margin-top: 10px;
        font-size: 18px;
        max-width: 400px;
        word-wrap: break-word;
        background-color: rgba($color: #cfe2f3, $alpha: 1);
        padding: 10px;
        border-radius: 10px;
      }
    }
    .chat-me {
      align-items: flex-start;
    }
  }

  .input-wrapper {
    height: 100px;
    position: absolute;
    bottom: 0;
    display: flex;
    width: 96%;
    justify-content: space-between;
    .input-left {
      width: 550px;
    }
    .input-btn {
      width: 150px;
    }
  }
}
</style>
