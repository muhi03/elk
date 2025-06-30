<script setup lang="ts">
const { t } = useI18n()

const engagementObjects = useUserSettings().value.engagementObjects

watch(
  () => engagementObjects,
  () => {
    engagementObjects.sort((a, b) => {
      return (b.timeSpent || 0) - (a.timeSpent || 0)
    })
  },
  { immediate: true }
)

useHydratedHead({
  title: () => `${t('nav.scroll_insights')} `,
})
// }

const getTimeString = (): string => {
  const secs = engagementObjects.reduce((total, item) => {
    return total + (item.timeSpent || 0)
  }, 0)

  const dateObj = new Date(secs * 1000)
  const hours = dateObj.getUTCHours()
  const minutes = dateObj.getUTCMinutes()
  const seconds = dateObj.getSeconds()
  const timeString =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0')
  return timeString
}
</script>

<template>
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
      v-if="engagementObjects.length != 0"
      w-full
      my-1
      py-1
      px-2
      text-align-right
      c-white
      font-semibold
      text-sm
      mr5
      bg-primary
      rounded-full
      h-auto
    >
      Total scrolling time: {{ getTimeString() }}
    </div>
    <div
      v-else
      w-full
      my-1
      py-1
      px-2
      text-align-right
      c-white
      font-semibold
      text-sm
      mr5
      bg-primary-light
      rounded-full
      h-auto
    >
      No data available yet. Please scroll through some content to gather
      insights.
    </div>
    <div
      v-for="engagementObject in engagementObjects"
      :key="engagementObject.account.id"
      class="scroll-item"
      py2
      px4
    >
      <AccountCardScroller
        v-if="engagementObject.timeSpent && engagementObject.timeSpent > 0"
        :engagement-object="engagementObject"
        hover-card
        border="b base"
        py2
        px4
      />
    </div>
  </MainContent>
</template>
