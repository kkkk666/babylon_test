<template>
  <el-container>
    <el-header height="auto" class="header-bg-container">
      <Header></Header>
    </el-header>
    <el-main class="container mx-auto flex justify-center p-6">
      <Page></Page>
    </el-main>
    <el-footer>
      <!--      <Footer></Footer>-->
    </el-footer>
  </el-container>
</template>

<script>
import Header from '../Header/Header.vue';
import Page from '../Page/Page.vue';
// import Footer from '../Footer/Footer.vue';

export default {
  name: 'AppProviders',
  components: { Header, Page },
  data() {
    return {
      defaultTheme: 'dark',
      initialIsOpen: false,
    };
  },
  mounted() {
  }
};
</script>
<style>
.header-bg-container {
  background: rgb(255, 255, 255);
}
</style>

