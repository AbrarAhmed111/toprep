import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Ephemeral (never persisted) set of selected topic IDs. Carried in shared
// Redux state so it survives across components within a workspace session
// and is ready to feed Global Search once Phase 3 lands.
interface SelectionState {
  selectedTopicIds: string[]
}

const initialState: SelectionState = {
  selectedTopicIds: [],
}

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    toggled(state, action: PayloadAction<string>) {
      const id = action.payload
      const index = state.selectedTopicIds.indexOf(id)
      if (index === -1) state.selectedTopicIds.push(id)
      else state.selectedTopicIds.splice(index, 1)
    },
    setSelection(state, action: PayloadAction<string[]>) {
      state.selectedTopicIds = action.payload
    },
    cleared(state) {
      state.selectedTopicIds = []
    },
  },
})

export const {
  toggled: topicSelectionToggled,
  setSelection: topicSelectionSet,
  cleared: topicSelectionCleared,
} = selectionSlice.actions

export default selectionSlice.reducer
