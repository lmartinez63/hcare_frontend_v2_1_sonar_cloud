<template>
  <v-footer
    id="core-footer"
    absolute
    height="82"
  >
    <div class="footer-items">
      <span
        v-for="link in links"
        :key="link.name"
      >
        <a
          :href="link.Link"
          class="tertiary--text footer-links"
        >{{ link.name }}</a>
      </span>
    </div>
    <v-spacer />
    <span class="font-weight-light copyright">
      &copy;
      {{ (new Date()).getFullYear() }}
      <a
        href="https://www.it-lmartinez.com"
        target="_blank"
      >Luis Martinez</a>, work done with the
      <v-icon
        color="tertiary"
        size="17"
      >mdi-heart</v-icon>
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: 'Home', Link: '/dashboard' },
      { name: 'Luis Martinez', Link: 'https://www.it-lmartinez.com' },
      { name: 'About Us', Link: 'https://it-lmartinez.com/presentation' },
      { name: 'Blog', Link: 'https://blog.it-lmartinez.com' }
    ]
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
