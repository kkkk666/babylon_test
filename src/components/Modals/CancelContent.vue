<template>
  <div class="text-text-black dark:text-white">
    <div class="mt-6 flex flex-col gap-4">
      <p>
        It looks like you didn’t complete your staking journey. We’d love
        to help you get back on track or hear about any issues you faced.
      </p>
      <ul class="list-disc pl-4">
        <li>
          <strong>Need Assistance?</strong> Reach out on our
          <a
            href="https://discord.com/invite/babylonglobal"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
          >
            Discord
          </a>
          (<code>#support</code> channel).
        </li>
        <li>
          <strong>Feedback:</strong> Let us know your thoughts on our
          <a
            href="https://forum.babylonlabs.io/c/feedback/44"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
          >
            Feedback Forum
          </a>
          or
          <a
            href="https://discord.com/invite/babylonglobal"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
          >
            Discord
          </a>
          (<code>#feedback</code> channel).
        </li>
      </ul>
      <p>
        Your feedback is crucial for us to improve and provide a seamless
        experience. Thank you for being a part of our Bitcoin Staking Protocol
        {{ networkName }}!
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CancelContent',
  props: {
    networkName: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
