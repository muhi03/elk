<script setup lang="ts">
import type { mastodon } from 'masto'

const { engagementObject } = defineProps<{
  engagementObject: EngagementObject
  hoverCard?: boolean
  relationshipContext?: 'followedBy' | 'following'
}>()

cacheAccount(engagementObject.account)
const isSelf = useSelfAccount(() => engagementObject.account)
const relationship = useRelationship(engagementObject.account)

const totalTimeSpent = computed(() => {
  return useUserSettings().value.engagementObjects.reduce(
    (total: number, item) => {
      return total + (item.timeSpent || 0)
    },
    0
  )
})

const timeSpentOfTotalToInteger = computed(() => {
  return Math.ceil(
    ((engagementObject.timeSpent ?? 0) / totalTimeSpent.value) * 100
  )
})
</script>

<template>
  <div hover:bg-active transition-100>
    <div
      my
      bg-primary-light
      py-1
      rounded-full
      :style="{ width: timeSpentOfTotalToInteger + '%' }"
    ></div>

    <div flex justify-between hover:bg-active transition-100>
      <AccountInfo
        :account="engagementObject.account"
        hover
        p1
        as="router-link"
        :hover-card="hoverCard"
        shrink
        overflow-hidden
        :to="getAccountRoute(engagementObject.account)"
      />
      <span inset-ie-0 flex gap-2 items-right>
        <slot h-full p1 shrink-0 v-if="!isSelf && relationship?.following">
          <CommonTooltip :content="$t('list.modify_account')">
            <VDropdown>
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
                <span i-ri:play-list-add-fill block text-current />
              </button>
              <template #popper>
                <ListLists :user-id="engagementObject.account.id" />
              </template>
            </VDropdown>
          </CommonTooltip>
        </slot>
        <slot h-full p1 shrink-0 v-if="!isSelf && !relationship?.blocking">
          <CommonTooltip
            :content="
              $t('menu.mute_account', [`@${engagementObject.account.acct}`])
            "
          >
            <button
              v-if="!relationship?.muting"
              rounded-full
              text-sm
              p2
              border-1
              transition-colors
              border-base
              hover:text-primary
              :aria-label="$t('list.mute_account')"
              @click="
                toggleMuteAccount(relationship!, engagementObject.account)
              "
            >
              <span i-ri:volume-mute-line block text-current />
            </button>
          </CommonTooltip>
        </slot>

        <slot>
          <AccountFollowButton
            :account="engagementObject.account"
            :context="relationshipContext"
          />
        </slot>
      </span>
    </div>
  </div>
</template>
