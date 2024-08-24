<template>
  <div class="container mx-auto flex flex-col items-center">
    <div class="w-24">
      <div class="divider my-1"></div>
    </div>
    <div class="flex justify-center gap-8 p-2">
      <button
      @click="openTerms"
      class="transition-colors hover:text-primary cursor-pointer btn btn-link no-underline text-base-content"
      >
      Terms of Use
    </button>
  </div>
  <div class="flex flex-wrap justify-center gap-8 p-4 pt-2 md:flex-row md:p-6 md:pt-2">
    <div v-for="(link, index) in iconLinks" :key="index" class="flex w-4 items-center justify-center text-[22px] text-xl">
    <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="transition-colors hover:text-primary"
    >
    <component :is="link.Icon" :title="link.name" />
  </a>
</div>
</div>
</div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { GoHome } from 'vue-icons/go';
  import { FaXTwitter } from 'vue-icons/fa';
  import { BsGithub, BsLinkedin, BsMedium, BsTelegram, BsDiscord } from 'vue-icons/bs';
  import { IoMdBook } from 'vue-icons/io';
  import { MdAlternateEmail } from 'vue-icons/md';

  export default {
  name: 'Footer',
  components: {
  GoHome,
  FaXTwitter,
  BsGithub,
  BsLinkedin,
  BsMedium,
  BsTelegram,
  IoMdBook,
  MdAlternateEmail,
  BsDiscord,
},
  data() {
  return {
  iconLinks: [
{ name: 'Website', url: 'https://babylonchain.io', Icon: 'GoHome' },
{ name: 'X', url: 'https://twitter.com/babylon_chain', Icon: 'FaXTwitter' },
{ name: 'GitHub', url: 'https://github.com/babylonchain', Icon: 'BsGithub' },
{ name: 'Telegram', url: 'https://t.me/babyloncommunity', Icon: 'BsTelegram' },
{ name: 'LinkedIn', url: 'https://www.linkedin.com/company/babylon-chain/', Icon: 'BsLinkedin' },
{ name: 'Medium', url: 'https://medium.com/babylonchain-io', Icon: 'BsMedium' },
{ name: 'Docs', url: 'https://docs.babylonchain.io/', Icon: 'IoMdBook' },
{ name: 'Email', url: 'mailto:contact@babylonchain.io', Icon: 'MdAlternateEmail' },
{ name: 'Discord', url: 'https://discord.com/invite/babylonglobal', Icon: 'BsDiscord' },
  ],
};
},
  methods: {
  ...mapActions(['openTerms']),
},
};
</script>

<style scoped>
  /* Add any required styles here */
</style>
