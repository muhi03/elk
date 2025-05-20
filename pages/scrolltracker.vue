<script setup lang="ts">
import Lists from '~/components/list/Lists.vue'

const { t } = useI18n()
// const params = useRoute().params
// const handle = computed(() => params.account as string)

// definePageMeta({ name: 'account-following' })

// const account = await fetchAccountByHandle(handle.value)
// const paginator = account ? useMastoClient().v1.accounts.$select(account.id).following.list() : null

const scrollTrackerData = useUserSettings().value.scrollTrackerData
scrollTrackerData.sort((a, b) => {
  return (b.timeSpent || 0) - (a.timeSpent || 0)
})

// const isSelf = useSelfAccount(account)

// if (account) {
//  useHydratedHead({
//    title: () => `${t('account.following')} | ${getDisplayName(account)} (@${account.acct})`,
//  })
// }
// if (account) {
useHydratedHead({
  title: () => `${t('nav.scroll_insights')} `,
})
// }
</script>

<template>
  <!-- <template v-if="paginator"> -->
  <!-- <AccountPaginator :paginator="paginator" :relationship-context="isSelf ? 'following' : undefined" context="following" :account="account" /> -->
  <!-- </template> -->
  <MainContent>
    <template #title>
      <NuxtLink
        to="/scrolltracker"
        timeline-title-style
        flex
        items-center
        gap-2
        @click="$scrollToTop"
      >
        <div i-tabler-users-group />
        <span>{{ $t('nav.scroll_insights') }}</span>
      </NuxtLink>
    </template>
    <div
      v-for="item in scrollTrackerData"
      :key="item.username"
      class="scroll-item"
      py2
      px4
    >
      <AccountCardScroller
        :account="item.account"
        :time-spent="item.timeSpent || 0"
        hover-card
        border="b base"
        py2
        px4
      />
    </div>
  </MainContent>
</template>
