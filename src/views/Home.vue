<template>
    <div class="home">
        <van-image round width="300" height="300" fit="cover" :src="require('../assets/song.jpg')" class="img" />
        <screen-locker></screen-locker>
    </div>
</template>

<script>
import { Image } from "vant";
import screenLocker from "@/components/screen-locker.vue";
export default {
  name: "Home",
  components: {
    [Image.name]: Image,
    screenLocker,
  },
};
</script>

<style lang="scss" scoped>
.img {
  margin-top: 300px;
}
</style>

