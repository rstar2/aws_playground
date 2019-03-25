<template>
	<md-dialog :md-active.sync="active">
        <md-dialog-title> {{ title }} </md-dialog-title>

        <md-dialog-content>
            <!-- <form novalidate class="md-layout" @submit.prevent="validateAdd"> -->

            <md-field :class="validateClass('email')">
                <label>Email</label>
                <md-input v-model="user.email"></md-input>
                <span class="md-error" v-if="!$v.user.email.required">The email is required</span>
                <span class="md-error" v-else-if="!$v.user.email.email">Email must be valid email.</span>
            </md-field>

            <md-field v-if="action === ACTIONS.REGISTER" :class="validateClass('name')">
                <label>Name</label>
                <md-input v-model="user.name"></md-input>
                <span class="md-error" v-if="!$v.user.name.required">The name is required</span>
                <span class="md-error" v-else-if="!$v.user.name.minlength">Name must have at least
                    {{$v.user.name.$params.minLength.min}} letters.</span>
            </md-field>

			<md-field v-if="action !== ACTIONS.REGISTER_CONFIRM" :class="validateClass('password')">
                <label>Password</label>
                <md-input v-model="user.password" type="password"></md-input>
                <span class="md-error" v-if="!$v.user.password.required">The password is required</span>
                <span class="md-error" v-else-if="!$v.user.password.minlength">Password must have at least
                    {{$v.user.password.$params.minLength.min}} letters.</span>
            </md-field>

            <md-field v-if="action === ACTIONS.REGISTER_CONFIRM" :class="validateClass('code')">
                <label>Code</label>
                <md-input v-model="code"></md-input>
                <span class="md-error" v-if="!$v.code.required">The code is required</span>
            </md-field>

            <md-dialog-actions>
                <md-button class="md-primary" @click="active = false">Close</md-button>
                <md-button type="submit" class="md-primary" @click="doAction" :disabled="disabled"> {{ action }}
                </md-button>
            </md-dialog-actions>

            <!-- </form> -->
        </md-dialog-content>
    </md-dialog>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";

export const ACTIONS = {
    LOGIN: "Login",
    REGISTER: "Register",
    REGISTER_CONFIRM: "Confirm"
};

export const MixinACTIONS = {
    beforeCreate: function () {
        this.ACTIONS = ACTIONS;
    }
};

export default {
    props: {
        show: { type: Boolean, default: false },
        action: { type: String, default: ACTIONS.LOGIN },
        userShow: { type: Object, default: null }
    },
    model: {
        prop: "show",
        event: "close"
    },
    computed: {
        title() {
            switch (this.action) {
                case ACTIONS.LOGIN:
                    return "Log as existing user";
                case ACTIONS.REGISTER:
                    return "Register as new user";
                case ACTIONS.REGISTER_CONFIRM:
                    return "Confirm registration";
            }
        },
        active: {
            // getter
            get: function () {
                return !!this.show;
            },
            // setter
            set: function (newValue) {
                if (!newValue) {
                    this.$emit("close", false);
                }
            }
        },
        disabled() {
            return false;
            // return this.$v.user.$invalid;
        }
    },
    data() {
        return {
            user: {
                // email: null,
                // name: null,
                // password: null
            },
            code: null
        };
    },
    watch: {
        userShow(userShow) {
            if (userShow) {
                this.user = { ...userShow };
            } else {
                this.user = {};
            }
        }
    },
    methods: {
        doAction() {
            // validate first and if any invalid field then return
            this.$v.user.$touch();
            this.$v.code.$touch();

            if (this.$v.user.$invalid || this.$v.code.$invalid) {
                // validation errors are shown already when this.$v.user.$touch() is called
                return;
            }

            this.$v.user.$reset();
            this.$v.code.$reset();

            this.active = false;

            this.$emit("action", { ...this.user }, this.code);
            this.user = {};
            this.code = null;
        },

        validateClass(fieldName) {
            // serach in global fields (currently just 'code')
            let field = this.$v[fieldName];
            if (!field) {
                // if not found search in 'user' subfields
                field = this.$v.user[fieldName];
            }

            if (field) {
                return {
                    "md-invalid": field.$invalid && field.$dirty
                };
            }
            return null;
        }
    },

    mixins: [/*Vuelidate integration*/ validationMixin, MixinACTIONS],

    // validation schema can be a function
    // which will make it dynamic and possibly dependant on your model's data.
    validations() {
        // common for login/register
        const user = {
            email: {
                required,
                email
            },
            password: {
                required,
                minLength: minLength(5)
            },
            name: {
                required,
                minLength: minLength(5)
            }
        };

        let code = { required };

        // only for register

        switch (this.action) {
            case ACTIONS.LOGIN:
                user.name = {};
                code = {};
                break;
            case ACTIONS.REGISTER:
                code = {};
                break;
            case ACTIONS.REGISTER_CONFIRM:
                user.password = {};
                user.name = {};
                break;
        }

        return {
            user,
            code
        };
    }
};
</script>
