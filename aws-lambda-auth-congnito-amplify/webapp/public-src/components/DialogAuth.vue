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
    
            <md-field v-if="isRegister" :class="validateClass('name')">
                <label>Name</label>
                <md-input v-model="user.name"></md-input>
                <span class="md-error" v-if="!$v.user.name.required">The name is required</span>
                <span class="md-error" v-else-if="!$v.user.name.minlength">Name must have at least
                    {{$v.user.name.$params.minLength.min}} letters.</span>
            </md-field>

			<md-field :class="validateClass('password')">
                <label>Password</label>
                <md-input v-model="user.password" type="password"></md-input>
                <span class="md-error" v-if="!$v.user.password.required">The password is required</span>
                <span class="md-error" v-else-if="!$v.user.password.minlength">Password must have at least
                    {{$v.user.password.$params.minLength.min}} letters.</span>
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

export default {
  props: {
    show: { type: Boolean, default: false },
    isRegister: { type: Boolean, default: false }
  },
  model: {
    prop: "show",
    event: "close"
  },
  computed: {
    title() {
      return this.isRegister ? "Auth register" : "Auth login";
    },
    action() {
      return this.isRegister ? "Sign up" : "Sign in";
    },
    active: {
      // getter
      get: function() {
        return !!this.show;
      },
      // setter
      set: function(newValue) {
        if (!newValue) {
          this.$emit("close");
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
        email: null,
        name: null,
        password: null
      }
    };
  },
  methods: {
    doAction() {
      // validate first and if any invalid field then return
      if (this.isRegister) {
        this.$v.user;
      }
      this.$v.user.$touch();

      if (this.$v.user.$invalid) {
        // validation errors are shown already when this.$v.user.$touch() is called
        return;
      }

      const user = this.user;

      this.user = {};
      this.$v.user.$reset();

      this.active = false;

      this.$emit("action", user);
    },

    validateClass(fieldName) {
      const field = this.$v.user[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
      return null;
    }
  },

  // Vuelidate integration
  mixins: [validationMixin],

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
      }
    };

    // only for register
    if (this.isRegister) {
      Object.assign(user, {
        name: {
          required,
          minLength: minLength(5)
        }
      });
    }

    return {
      user
    };
  }
};
</script>
