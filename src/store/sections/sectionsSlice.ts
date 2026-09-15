import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Section } from '@/types/preparation'
import {
  readCollection,
  writeCollection,
  STORAGE_KEYS,
} from '@/lib/storage/localStorageRepo'

interface SectionsState {
  items: Section[]
  hydrated: boolean
}

const initialState: SectionsState = {
  items: [],
  hydrated: false,
}

const persist = (items: Section[]) =>
  writeCollection(STORAGE_KEYS.sections, items)

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    hydrated(state) {
      state.items = readCollection<Section>(STORAGE_KEYS.sections)
      state.hydrated = true
    },
    added(state, action: PayloadAction<Section>) {
      state.items.push(action.payload)
      persist(state.items)
    },
    updated(state, action: PayloadAction<Section>) {
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
    reordered(
      state,
      action: PayloadAction<{ preparationId: string; orderedIds: string[] }>,
    ) {
      const { preparationId, orderedIds } = action.payload
      const positionById = new Map(orderedIds.map((id, index) => [id, index]))
      for (const item of state.items) {
        if (item.preparationId !== preparationId) continue
        const position = positionById.get(item.id)
        if (position !== undefined) item.position = position
      }
      persist(state.items)
    },
  },
})

export const {
  hydrated: sectionsHydrated,
  added: sectionAdded,
  updated: sectionUpdated,
  removed: sectionRemoved,
  removedByPreparation: sectionsRemovedByPreparation,
  reordered: sectionsReordered,
} = sectionsSlice.actions

export default sectionsSlice.reducer
