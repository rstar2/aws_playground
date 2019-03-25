<template>
	<!-- :md-active.sync needs a boolean prop -->
    <md-snackbar :md-active.sync="active" md-position="center" :md-duration="3000" md-persistent>
        <span>{{info}}</span>
        <md-button class="md-accent" @click="active = false">Dismiss</md-button>
    </md-snackbar>
</template>

<script>
export default {
    props: {
        info: {
            type: String,
            default: null
        }
    },
    model: {
        prop: "info",
        event: "change"
    },
    computed: {
        // we need a getter AND a setter as 'active' is set when using :md-active.sync="active", to auto close it
        active: {
            // getter
            get: function () {
                return !!this.info;
            },
            // setter
            set: function (newValue) {
                if (!newValue) {
                    this.$emit("change", null);
                }
            }
        }
    }
};
</script>
