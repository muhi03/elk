import type { LocaleObject } from '@nuxtjs/i18n'
import type { Ref } from 'vue'
import type {
  FontSize,
  OldFontSize,
  PreferencesSettings,
  UserSettings,
} from './definition'
import { oldFontSizeMap } from '~~/constants/options'
import { STORAGE_KEY_SETTINGS } from '~/constants'

export function useUserSettings() {
  const { locales } = useNuxtApp().$i18n
  const supportLanguages = (unref(locales) as LocaleObject[]).map(
    (locale) => locale.code
  )
  const settingsStorage = useUserLocalStorage<UserSettings>(
    STORAGE_KEY_SETTINGS,
    () => getDefaultUserSettings(supportLanguages)
  )

  // Convert scrollTrackerSettings to a Map when accessing
  // if (settingsStorage.value.scrollTrackerSettings) {
  // settingsStorage.value.scrollTrackerSettings = new Map(
  // JSON.parse(settingsStorage.value.scrollTrackerSettings)
  // )
  // }

  // Backward compatibility, font size was xs, sm, md, lg, xl before
  if (
    settingsStorage.value.fontSize &&
    !settingsStorage.value.fontSize.includes('px')
  ) {
    settingsStorage.value.fontSize = oldFontSizeMap[
      settingsStorage.value.fontSize as OldFontSize
    ] as FontSize
  }

  return settingsStorage
}

// TODO: refactor & simplify this

export function usePreferences<T extends keyof PreferencesSettings>(
  name: T
): Ref<PreferencesSettings[T]> {
  const userSettings = useUserSettings()
  return computed({
    get() {
      return getPreferences(userSettings.value, name)
    },
    set(value) {
      userSettings.value.preferences[name] = value
    },
  })
}

export function getPreferences<T extends keyof PreferencesSettings>(
  userSettings: UserSettings,
  name: T
): PreferencesSettings[T] {
  const preference =
    userSettings?.preferences?.[name] ?? DEFAULT__PREFERENCES_SETTINGS[name]

  if (name === 'enableAutoplay')
    return getPreferences(userSettings, 'enableDataSaving') ? false : preference

  return preference
}

export function togglePreferences(key: keyof PreferencesSettings) {
  const flag = usePreferences(key)
  flag.value = !flag.value
}

// export function useScrollTracker(): Ref<Map<string, number>> {
//   const userSettings = useUserSettings()
//   return computed({
//     get() {
//       console.log(
//         'userSettings.value.scrollTrackerSettings: ',
//         userSettings.value.scrollTrackerSettings
//       )
//       // Check if scrollTrackerSettings is a string and parse it
//       if (typeof userSettings.value.scrollTrackerSettings === 'string') {
//         // userSettings.value.scrollTrackerSettings = JSON.parse(
//         //     userSettings.value.scrollTrackerSettings
//         //   )
//         // }

//         return new Map(
//           JSON.parse(userSettings.value.scrollTrackerSettings) // JSON.parse(userSettings.value.scrollTrackerSettings) ||#
//         )
//       } else {
//         return new Map<string, number>()
//       }
//       // return userSettings.value.scrollTrackerSettings ?? JSON.parse(userSettings.value.scrollTrackerSettings) : new Map<string, number>()
//       // Object.entries(userSettings.value.scrollTrackerSettings || {}) // JSON.parse(userSettings.value.scrollTrackerSettings) ||#
//       // Object.entries(JSON.parse || {}) // JSON.parse(userSettings.value.scrollTrackerSettings) ||#
//       // new Map<string, number>()
//     },
//     set(value: Map<string, number>) {
//       // userSettings.value.scrollTrackerSettings = Object.fromEntries(value) // JSON.stringify(value)
//       userSettings.value.scrollTrackerSettings = JSON.stringify(value) // Object.fromEntries(value) // JSON.stringify(value)
//     },
//   })
// }

// export function useScrollTracker(): Ref<Map<string, number>> {
//   const userSettings = useUserSettings()

//   const tracker = ref(new Map<string, number>())

//   // // Initialize tracker from userSettings
//   // watch(
//   //   () => userSettings.value.scrollTrackerSettings,
//   //   (newSettings) => {
//   //     if (newSettings) {
//   //       console.log('newSettings: ', newSettings)
//   //       // Convert to Map if it's an object
//   //       tracker.value = new Map(Object.entries(newSettings))
//   //     }
//   //   },
//   //   { immediate: true }
//   // )

//   // // Persist tracker changes to userSettings
//   // watch(
//   //   tracker,
//   //   (newTracker) => {
//   //     console.log('newTracker: ', newTracker)
//   //     userSettings.value.scrollTrackerSettings = Object.fromEntries(newTracker)
//   //   },
//   //   { deep: true }
//   // )

//   return tracker
// }

export function useScrollTrackerData(): Ref<any[]> {
  const userSettings = useUserSettings()

  return computed({
    get() {
      // Check if scrollTrackerData is a string and parse it
      if (userSettings.value.scrollTrackerData === undefined)
        userSettings.value.scrollTrackerData = []
      return userSettings.value.scrollTrackerData
    },
    set(value: any[]) {
      userSettings.value.scrollTrackerData = value
    },
  })
}
