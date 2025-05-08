<script setup lang="ts">
import type { UseDateFormatReturn } from '@vueuse/core/index.cjs'
import type { mastodon } from 'masto'
import Scrolltracker from '~/pages/scrolltracker.vue'

const { account } = defineProps<{
  account?: mastodon.v1.Account
  username: mastodon.v1.Account['username']
  hoverCard?: boolean
  start: Date
  end?: Date
}>()

// cacheAccount(account)

// function showSpendTime() {
//   const scrollTracker = useScrollTracker()
//   const values = ScrollTracker.value
//   return values.get(account.username.toString())
// }

// console.log('account', account)
</script>

<template>
  <div flex justify-between hover:bg-active transition-100>
    <!-- <AccountInfo
      :account="account"
      hover
      p1
      as="router-link"
      :hover-card="hoverCard"
      shrink
      overflow-hidden
      :to="getAccountRoute(account)"
    /> -->
    <!-- <slot> -->
    <div h-full p1 shrink-0>
      <!-- <AccountFollowButton
          :account="account"
          :context="relationshipContext"
        /> -->
      <div>{{ username }}</div>
    </div>
    <!-- </slot> -->
  </div>
</template>
