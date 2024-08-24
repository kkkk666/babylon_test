<template>
  <div class="container mx-auto flex flex-col gap-2 p-6">
    <h3 class="mb-4 font-bold">FAQ</h3>
    <div class="flex flex-col gap-4">
      <section-item
        v-for="question in questionsList"
      :key="question.title"
      :title="question.title"
      :content="question.content"
      />
    </div>
  </div>
</template>

<script>
  import { getNetworkConfig } from "@/config/network.config";
  import { questions } from "./data/questions";
  import SectionItem from "./SectionItem.vue"; // Assuming you have renamed Section component to SectionItem.vue

  export default {
  components: {
  SectionItem,
},
  data() {
  return {
  questionsList: [],
};
},
  created() {
  const { coinName } = getNetworkConfig();
  this.questionsList = questions(coinName);
},
};
</script>
