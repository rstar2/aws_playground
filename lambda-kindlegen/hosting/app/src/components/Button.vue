<template>
  <!-- https://cssbuttons.app/buttons/9 -->
  <button v-on="$listeners" v-bind="$props" class="bn9" >
    <span><slot/></span>
  </button>
</template>

// <script>
// export default {
//   props: {
//     text: {
//       type: String,
//       required: true
//     }
//   }
// }
// </script>

<style>
/* Nice button styles taken from https://cssbuttons.app */
.bn9 {
  padding: 2px;
  outline: 0;
  font-size: 17px;
  color: rgb(255, 255, 255);
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(#fdde5c),
    color-stop(#f8ab5e),
    color-stop(#f56a62),
    color-stop(#a176c8),
    color-stop(#759beb),
    color-stop(#65beb3),
    to(#70db96)
  );
  background: linear-gradient(
    to right,
    #fdde5c,
    #f8ab5e,
    #f56a62,
    #a176c8,
    #759beb,
    #65beb3,
    #70db96
  );
  border-radius: 30px;
  border: 0;
  box-shadow: none;
  cursor: pointer;
}

.bn9 > span {
  display: block;
  padding: 10px 20px;
  font-size: 17px;
  background: #000;
  border-radius: 30px;
}

.bn9:disabled {
    cursor: default;
    background: dimgrey;
}
</style>
