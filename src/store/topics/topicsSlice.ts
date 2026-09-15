import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Topic } from '@/types/preparation'
import {
  readCollection,
  writeCollection,
  STORAGE_KEYS,
} from '@/lib/storage/localStorageRepo'

interface TopicsState {
  items: Topic[]
  hydrated: boolean
}

const initialState: TopicsState = {
  items: [],
  hydrated: false,
}

const persist = (items: Topic[]) => writeCollection(STORAGE_KEYS.topics, items)

const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    hydrated(state) {
      state.items = readCollection<Topic>(STORAGE_KEYS.topics)
      state.hydrated = true
    },
    added(state, action: PayloadAction<Topic>) {
      state.items.push(action.payload)
      persist(state.items)
    },
    addedMany(state, action: PayloadAction<Topic[]>) {
      state.items.push(...action.payload)
      persist(state.items)
    },
    updated(state, action: PayloadAction<Topic>) {
      const index = state.items.findIndex(item => item.id === action.payload.id)
      if (index !== -1) state.items[index] = action.payload
      persist(state.items)
    },
    removed(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload)
      persist(state.items)
    },
    removedByPreparation(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        item => item.preparationId !== action.payload,
      )
      persist(state.items)
    },
  },
})

export const {
  hydrated: topicsHydrated,
  added: topicAdded,
  addedMany: topicsAddedMany,
  updated: topicUpdated,
  removed: topicRemoved,
  removedByPreparation: topicsRemovedByPreparation,
} = topicsSlice.actions

export default topicsSlice.reducer
