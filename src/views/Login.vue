<template>
  <v-container fill-height="fill-height">
    <v-layout
      align-center="align-center"
      justify-center="justify-center"
    >
      <v-flex class="login-form text-xs-center">
        <div class="display-1 mb-3">
          <v-icon
            class="mr-2"
            large="large"
          >
            mdi-work
          </v-icon>HCare
        </div>
        <v-card light="light">
          <v-card-text>
            <div class="subheading">
              <template v-if="options.isLoggingIn">
                Entrar al portal de HCare
              </template>
              <template v-else>
                Crear una nueva cuenta
              </template>
            </div>
            <v-form>
              <v-text-field
                v-if="!options.isLoggingIn"
                v-model="user.name"
                light="light"
                prepend-icon="mdi-person"
                label="Name"
              />
              <form-group
                :validator="$v.username"
                :messages="localMessages"
                attribute="Usuario"
              >
                <v-text-field
                  v-model="username"
                  light="light"
                  prepend-icon="mdi-email"
                  label="Usuario"
                  type="text"
                  @input="$v.username.$touch()"
                />
              </form-group>
              <v-text-field
                v-model="password"
                light="light"
                prepend-icon="mdi-lock"
                label="Password"
                type="password"
                @input="$v.password.$touch()"
              />
              <v-checkbox
                v-if="options.isLoggingIn"
                v-model="options.shouldStayLoggedIn"
                light="light"
                label="Stay logged in?"
                hide-details="hide-details"
              />
              <v-btn
                v-if="options.isLoggingIn"
                block="block"
                type="submit"
                @click.native="handleSubmit"
                @click.prevent=""
              >
                Iniciar Sesion
              </v-btn>
              <v-btn
                v-else
                block="block"
                type="submit"
                @click.prevent="options.isLoggingIn = true"
              >
                Registrarse
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <div v-if="options.isLoggingIn">
          No tienes una cuenta?
          <v-btn
            light="light"
            @click="options.isLoggingIn = false"
          >
            Registrarse
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      username: '',
      password: '',
      localMessages: {
        required: 'Campo {attribute} es requerido.'
      },
      options: {
        isLoggingIn: true,
        shouldStayLoggedIn: true
      }
    }
  },
  validations: {
    username: {
      required
    },
    password: {
      required
    }
  },
  created () {
    console.log('Login - Created - begin')
    // reset login status
    // this.$store.dispatch('authentication/logout');
    console.log('Login - Created - end')
  },
  methods: {
    handleSubmit (e) {
      this.submitted = true
      const { dispatch } = this.$store
      const { username, password } = this
      this.$v.$touch()
      if (this.$v.$invalid) {
        // selfVue.$parent.errorMessage("Por favor complete los campos requeridos")
        dispatch('alert/warning', 'Por favor complete los campos requeridos')
      } else {
        dispatch('authentication/login', {
          username,
          password
        })
      }
    }
  }
}
</script>
