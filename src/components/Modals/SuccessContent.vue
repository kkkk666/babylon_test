<template>
  <div class="text-text-black dark:text-white">
    <div class="mt-6 flex flex-col gap-4">
      <p>
        You have successfully completed your Bitcoin staking journey on our
        {{ networkName }}. Your contribution helps secure the decentralized
        economy.
      </p>
      <ul class="list-disc pl-4">
        <li>
          <strong>Feedback:</strong> Share your experience on our
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
        <li>
          <strong>Report Bugs:</strong> Help us improve by reporting any
          issues on our
          <a
            href="https://forum.babylonlabs.io/c/support/45"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary"
          >
            Support Forum
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
          (<code>#support</code> channel).
        </li>
      </ul>
      <p>Thank you for being a part of the Babylon community!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessContent',
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
