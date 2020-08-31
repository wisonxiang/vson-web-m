<template>
  <div class="home">
      <van-button type="warning" class="btn">警告按钮</van-button>
  </div>
</template>

<script>
import { Button } from 'vant';
export default {
  name: "Home",
  components: {
    [Button.name]: Button,
  }
};
</script>

<style lang="scss" scoped>
.btn{
    width: 375px;
}
</style>

