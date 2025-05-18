<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
  hoverCard?: boolean
  relationshipContext?: 'followedBy' | 'following'
  timeSpent: number
}>()

cacheAccount(account)

const isSelf = useSelfAccount(() => account)
const relationship = useRelationship(account)
</script>

<template>
  <div flex justify-between hover:bg-active transition-100>
    <AccountInfo
      :account="account"
      hover
      p1
      as="router-link"
      :hover-card="hoverCard"
      shrink
      overflow-hidden
      :to="getAccountRoute(account)"
    />
    <!-- <slot>
      <div h-full p1 shrink-0>{{ timeSpent.toFixed(2) }} seconds</div>
    </slot> -->
    <span inset-ie-0 flex gap-2 items-right>
      <slot h-full p1 shrink-0>
        <CommonTooltip :content="$t('list.modify_account')">
          <VDropdown v-if="!isSelf && relationship?.following">
            <!-- missing is still the proper design and maybe a check for user account if it is self -->
            <!-- <VDropdown> -->
            <button
              :aria-label="$t('list.modify_account')"
              rounded-full
              text-sm
              p2
              border-1
              transition-colors
              border-base
              hover:text-primary
            >
              <!-- border-red
              text-red -->
              <span i-ri:play-list-add-fill block text-current />
            </button>
            <template #popper>
              <ListLists :user-id="account.id" />
            </template>
          </VDropdown>
        </CommonTooltip>
      </slot>

      <slot>
        <!-- <div h-full p1 shrink-0> -->
        <AccountFollowButton
          :account="account"
          :context="relationshipContext"
        />
        <!-- </div> -->
      </slot>
    </span>
  </div>
</template>
