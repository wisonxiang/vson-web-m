<template>
  <div class="page-wrapper">
    <div class="handler-wrapper">
      <van-button type="primary" @click="start">start</van-button>
      <van-button type="primary" @click="call">call</van-button>
      <van-button type="primary" @click="hangup">hangup</van-button>
    </div>
    <video autoplay ref="APlayer" class="player-box"></video>
    <video autoplay ref="BPlayer" class="player-box"></video>
  </div>
</template>

<script>
import { Button } from "vant";
export default {
  components: {
    [Button.name]: Button,
  },
  data() {
    return {
        pc1:null,
        pc2:null,
        localStream:null
    };
  },
  methods: {
    async start() {
      const constrants = {
        video: true,
        audio: false,
      };
      this.localStream = await navigator.mediaDevices.getUserMedia(constrants);
      this.$refs.APlayer.srcObject = this.localStream;
    },
    call(){
        this.pc1 = new RTCPeerConnection();
        this.pc2 = new RTCPeerConnection();

        this.pc1.onicecandidate = (e)=>{
            this.pc2.addIceCandidate(e.candidate)
        }
        this.pc2.onicecandidate = (e)=>{
            this.pc1.addIceCandidate(e.candidate)
        }
        // this.pc2.ontrack = function getRemoteStream(e){
        //     this.$refs.BPlayer.srcObject = e.streams[0]
        // }
        this.pc2.ontrack = (e)=>{
            console.log('222');
            this.$refs.BPlayer.srcObject = e.streams[0]
        }
        this.localStream.getTracks().forEach((track)=>{
          console.log('333');
            this.pc1.addTrack(track,this.localStream)
        })

        const offerOptions = {
            offerToRecieveAudio: 0,
            offerToRecieveVideo: 1
        }
        this.pc1.createOffer(offerOptions).then((desc)=>{
            // send desc to signal
            // receive desc from signal
            console.log('111');
            this.pc1.setLocalDescription(desc);
            this.pc2.setRemoteDescription(desc)
            this.pc2.createAnswer().then((desc)=>{
                this.pc2.setLocalDescription(desc)
                // send desc to signal
                // receive desc from signal
                this.pc1.setRemoteDescription(desc)
            })
        })
    },
    hangup(){
        this.pc1.close()
        this.pc2.close()
    }
  },
};
</script>

<style lang="scss" scoped>
.handler-wrapper {
  display: flex;
  justify-content: space-evenly;
  margin: 20px 0;
}
.player-box {
  width: 750px;
  height: 750px;
}
</style>
