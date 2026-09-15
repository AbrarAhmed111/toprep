// store.js
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import sampleReducer from './sample/SampleSlice'
import preparationsReducer from './preparations/preparationsSlice'
import topicsReducer from './topics/topicsSlice'
import sectionsReducer from './sections/sectionsSlice'
import selectionReducer from './selection/selectionSlice'

const rootReducer = combineReducers({
  sampleData: sampleReducer,
  preparations: preparationsReducer,
  topics: topicsReducer,
  sections: sectionsReducer,
  selection: selectionReducer,
})

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
