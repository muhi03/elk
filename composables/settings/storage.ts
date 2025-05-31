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

export function resetTrackerDataOnUncheck(key: keyof PreferencesSettings) {
  const scrollTrackerData = useScrollTrackerData()
  console.log(useUserSettings().value.engagementObjects)
  const flag = usePreferences(key)
  if (flag.value) {
    scrollTrackerData.value = []
  }
  flag.value = !flag.value

  console.log(useUserSettings().value.engagementObjects)
}

export function removeEngagementInsights() {
  const userSettings = useUserSettings()
  userSettings.value.engagementObjects = []
}

export function useScrollTrackerData(): Ref<any[]> {
  const userSettings = useUserSettings()

  return computed({
    get() {
      // Check if scrollTrackerData is a string and parse it
      if (userSettings.value.engagementObjects === undefined)
        userSettings.value.engagementObjects = []
      return userSettings.value.engagementObjects
    },
    set(value: any[]) {
      userSettings.value.engagementObjects = value
    },
  })
}
