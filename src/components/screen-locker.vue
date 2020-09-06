<template>
    <div class="wrapper" v-if="showlock">
        <canvas id="canvas" ref="canvas" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd"></canvas>
    </div>
</template>

<script>
export default {
  name: "screenLocker",
  data() {
    return {
      canvas: null,
      ctx: null,
      touchFlag: false,
      r: 0,
      lastPoint: [],
      allPoint: [],
      restPoint: [],

      showlock: true,
    };
  },
  methods: {
    getPosition(e) {
      var rect = e.currentTarget.getBoundingClientRect();
      var po = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
      return po;
    },
    pickPoints(fromPt, toPt) {
      var lineLength = getDis(fromPt, toPt);
      var dir = toPt.index > fromPt.index ? 1 : -1;

      var len = this.restPoint.length;
      var i = dir === 1 ? 0 : len - 1;
      var limit = dir === 1 ? len : -1;

      while (i !== limit) {
        var pt = this.restPoint[i];

        if (getDis(pt, fromPt) + getDis(pt, toPt) === lineLength) {
          // this.drawPoint(pt.x, pt.y);
          this.lastPoint.push(pt);
          this.restPoint.splice(i, 1);
          if (limit > 0) {
            i--;
            limit--;
          }
        }
        i += dir;
      }
    },
    update(po) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      for (var i = 0; i < this.allPoint.length; i++) {
        // 每帧先把面板画出来
        this.drawCle(this.allPoint[i].x, this.allPoint[i].y);
      }

      this.drawPoint(this.lastPoint); // 每帧画圆心
      this.drawLine(po, this.lastPoint); // 每帧花轨迹
      for (var i = 0; i < this.restPoint.length; i++) {
        var pt = this.restPoint[i];

        if (Math.abs(po.x - pt.x) < this.r && Math.abs(po.y - pt.y) < this.r) {
          // this.drawPoint(pt.x, pt.y);
          this.pickPoints(this.lastPoint[this.lastPoint.length - 1], pt);
          break;
        }
      }
    },
    drawLine(po, lastPoint) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.lastPoint[0].x, this.lastPoint[0].y);
      for (var i = 1; i < this.lastPoint.length; i++) {
        this.ctx.lineTo(this.lastPoint[i].x, this.lastPoint[i].y);
      }
      this.ctx.lineTo(po.x, po.y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    drawPoint() {
      // 初始化圆心
      for (var i = 0; i < this.lastPoint.length; i++) {
        this.ctx.fillStyle = "#CFE6FF";
        this.ctx.beginPath();
        this.ctx.arc(
          this.lastPoint[i].x,
          this.lastPoint[i].y,
          this.r / 2,
          0,
          Math.PI * 2,
          true
        );
        this.ctx.closePath();
        this.ctx.fill();
      }
    },
    drawCle(x, y) {
      this.ctx.strokeStyle = "#CFE6FF";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
      this.ctx.closePath();
      this.ctx.stroke();
    },
    createCircle() {
      let lockLine = 3;
      let count = 0;
      this.r = this.ctx.canvas.width / (2 + 4 * lockLine); // 公式计算
      this.lastPoint = [];
      this.restPoint = [];
      this.allPoint = [];
      let r = this.r;

      for (var i = 0; i < lockLine; i++) {
        for (var j = 0; j < lockLine; j++) {
          count++;
          var obj = {
            x: j * 4 * r + 3 * r,
            y: i * 4 * r + 3 * r,
            index: count,
          };
          this.allPoint.push(obj);
          this.restPoint.push(obj);
        }
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      for (var i = 0; i < this.allPoint.length; i++) {
        this.drawCle(this.allPoint[i].x, this.allPoint[i].y);
      }
    },
    initLock() {
      this.canvas = this.$refs.canvas;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerWidth;
      this.ctx = this.canvas.getContext("2d");
      this.createCircle();
    },
    // bindEvent() {
    //   this.canvas.addEventListener("touchstart",
    // },
    touchStart(e) {
      var po = this.getPosition(e);
      for (var i = 0; i < this.allPoint.length; i++) {
        if (
          Math.abs(po.x - this.allPoint[i].x) < this.r &&
          Math.abs(po.y - this.allPoint[i].y) < this.r
        ) {
          this.touchFlag = true;

          this.lastPoint.push(this.allPoint[i]);
          this.restPoint.splice(i, 1);
          this.drawPoint(this.allPoint[i].x, this.allPoint[i].y);
          break;
        }
      }
    },
    touchMove(e) {
      if (this.touchFlag) {
        this.update(this.getPosition(e));
      }
    },
    touchEnd(e) {
      let password = this.lastPoint.map((item) => {
        return item.index;
      });
      if (this.touchFlag) {
        this.touchFlag = false;
        if (password.toString() == [1, 5, 9].toString()) {
          this.drawStatusPoint("#2CFF26");
          setTimeout(() => {
            document.body.removeEventListener(
              "touchmove",
              function(e) {
                e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
              },
              { passive: true }
            ); //passive 参数不能省略，用来兼容ios和android
            this.showlock = false;
          }, 300);
        } else {
          this.drawStatusPoint("#ff0000");
          setTimeout(() => {
            this.reset();
          }, 300);
        }
      }
    },
    reset() {
      // this.makeState();
      this.createCircle();
    },
    drawStatusPoint(type) {
      for (let i = 0; i < this.lastPoint.length; i++) {
        this.ctx.strokeStyle = type;
        this.ctx.beginPath();
        this.ctx.arc(
          this.lastPoint[i].x,
          this.lastPoint[i].y,
          this.r,
          0,
          Math.PI * 2,
          true
        );
        this.ctx.closePath();
        this.ctx.stroke();
      }
    },
  },
  mounted() {
    document.body.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      },
      { passive: false }
    ); //passive 参数不能省略，用来兼容ios和android
    this.initLock();
  },
};
function getDis(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
function pd(e) {
  e.preventDefault();
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
}
</style>


