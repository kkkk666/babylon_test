<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <page></page>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from './components/Header/Header.vue';
import Page from './components/Page/Page.vue';
import Footer from './components/Footer/Footer.vue';

export default {
  name: 'AppProviders',
  components: { Header, Page, Footer },
  data() {
    return {
      defaultTheme: 'dark',
      initialIsOpen: false,
    };
  },
};
</script>
