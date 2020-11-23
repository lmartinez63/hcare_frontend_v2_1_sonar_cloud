<template>
  <v-card
    v-bind="$attrs"
    :style="styles"
    v-on="$listeners"
  >
    <helper-offset
      v-if="hasOffset"
      :inline="inline"
      :full-width="fullWidth"
      :offset="offset"
    >
      <v-card
        v-if="!$slots.offset"
        :color="color"
        :class="`elevation-${elevation}`"
        class="v-card--material__header"
        dark
      >
        <slot
          v-if="!title && !text"
          name="header"
        />
        <span v-else>
          <v-layout>
            <v-flex xs6>
              <h4
                class="title font-weight-light mb-2"
                v-text="title"
              />
            </v-flex>
            <v-flex xs6>
              <h4
                class="title font-weight-light mb-2"
                align="right"
                v-text="coTitle"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text"
              />
            </v-flex>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text1"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text2"
              />
            </v-flex>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text3"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text4"
              />
            </v-flex>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text5"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text6"
              />
            </v-flex>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text7"
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text8"
              />
            </v-flex>
            <v-flex xs6>
              <p
                class="category font-weight-thin"
                v-text="text9"
              />
            </v-flex>
          </v-layout>
        </span>
      </v-card>
      <slot
        v-else
        name="offset"
      />
    </helper-offset>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider
      v-if="$slots.actions"
      class="mx-3"
    />

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    color: {
      type: String,
      default: 'secondary'
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    inline: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: undefined
    },
    coTitle: {
      type: String,
      default: undefined
    },
    text: {
      type: [Number, String],
      default: undefined
    },
    text1: {
      type: [Number, String],
      default: undefined
    },
    text2: {
      type: [Number, String],
      default: undefined
    },
    text3: {
      type: [Number, String],
      default: undefined
    },
    text4: {
      type: [Number, String],
      default: undefined
    },
    text5: {
      type: [Number, String],
      default: undefined
    },
    text6: {
      type: [Number, String],
      default: undefined
    },
    text7: {
      type: [Number, String],
      default: undefined
    },
    text8: {
      type: [Number, String],
      default: undefined
    },
    text9: {
      type: [Number, String],
      default: undefined
    }
  },

  computed: {
    hasOffset () {
      return this.$slots.header ||
        this.$slots.offset ||
        this.title ||
        this.text
    },
    styles () {
      if (!this.hasOffset) return null

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`
      }
    }
  }
}
</script>

<style lang="scss">
  .v-card--material {
    &__header {
      &.v-card {
        border-radius: 4px;
      }
    }
  }
</style>
