import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Preparation } from '@/types/preparation'
import {
  readCollection,
  writeCollection,
  STORAGE_KEYS,
} from '@/lib/storage/localStorageRepo'

interface PreparationsState {
  items: Preparation[]
  hydrated: boolean
}

const initialState: PreparationsState = {
  items: [],
  hydrated: false,
}

const persist = (items: Preparation[]) =>
  writeCollection(STORAGE_KEYS.preparations, items)

const preparationsSlice = createSlice({
  name: 'preparations',
  initialState,
  reducers: {
    hydrated(state) {
      state.items = readCollection<Preparation>(STORAGE_KEYS.preparations)
      state.hydrated = true
    },
    added(state, action: PayloadAction<Preparation>) {
      state.items.unshift(action.payload)
      persist(state.items)
    },
    updated(state, action: PayloadAction<Preparation>) {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
      persist(state.items)
    },
    removed(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload)
      persist(state.items)
    },
  },
})

export const {
  hydrated: preparationsHydrated,
  added: preparationAdded,
  updated: preparationUpdated,
  removed: preparationRemoved,
} = preparationsSlice.actions

export default preparationsSlice.reducer
