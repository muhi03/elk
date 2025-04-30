<script setup lang="ts">
import { rand } from "@vueuse/core";
import { onMounted } from "vue";
const { t } = useI18n();
const params = useRoute().params;
const handle = computed(() => params.account as string);

//definePageMeta({ name: 'account-following' })

// const account = await fetchAccountByHandle(handle.value)
//const paginator = account ? useMastoClient().v1.accounts.$select(account.id).following.list() : null

//const isSelf = useSelfAccount(account)

//if (account) {
//  useHydratedHead({
//    title: () => `${t('account.following')} | ${getDisplayName(account)} (@${account.acct})`,
//  })
//}
// if (account) {
useHydratedHead({
  title: () => `${t("nav.scroll_tracker_list")} `,
});
// }

// onMounted(() => {
//   console.log("Mounted");
//   const tracker = useScrollTracker();
//   console.log("tracker", tracker);

//   const newMap = tracker.value;
//   newMap.set("someKey", rand(1, 100));
//   tracker.value = newMap;
//   console.log("tracker.value", tracker.value);
// });

onMounted(() => {
  console.log("Mounted");
  const tracker = useScrollTracker();

  // Ensure tracker.value is a Map
  if (!(tracker.value instanceof Map)) {
    tracker.value = new Map();
  }

  // Now safely use the set method
  tracker.value.set("someKey", rand(1, 100));
  tracker.value = new Map(tracker.value); // Trigger reactivity

  if (tracker.value.has("someKey")) {
    tracker.value.set("someKey", 1000);
    tracker.value = new Map(tracker.value); // Trigger reactivity
    console.log("Key exists:", tracker.value.get("someKey"));
  } else {
    console.log("Key does not exist");
  }
});
</script>

<template>
  <!-- <template v-if="paginator"> -->
  <!-- <AccountPaginator :paginator="paginator" :relationship-context="isSelf ? 'following' : undefined" context="following" :account="account" /> -->
  <!-- </template> -->
  <template>
    <NuxtLink
      to="/scrolltracker"
      timeline-title-style
      flex
      items-center
      gap-2
      @click="$scrollToTop"
    >
      <div i-ri:home-5-line />
      <span>{{ $t("nav.scroll_tracker_list") }}</span>
    </NuxtLink>

    <!-- <TimelinePinned v-if="isHydrated && currentUser" /> -->
  </template>
</template>
