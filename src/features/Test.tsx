import { FC } from 'react'
import { create } from 'zustand'

type State = {
  obj: { [key: string]: string }
}

type Actions = {
  setObj: (obj: { [key: string]: string }) => void
  removeKey: (key: string) => void
  removeKey2: (key: string) => void
}

const useTestStore = create<State & Actions>((set, get) => ({
  obj: {},
  setObj: (obj) => {
    set({ obj })
  },
  removeKey: (key) => {
    set((state) => {
      //const obj = state.obj
      //delete obj[key]
      //return { obj }

      console.log('before', state.obj)
      const newObj = { ...state.obj }
      delete newObj[key]
      console.log('set obj', newObj)
      return { obj: newObj }
    })
  },
  removeKey2: (key) => {
    const o = get().obj
    console.log('before', o)
    const n = Object.fromEntries(Object.entries(o).filter((e) => e[0] !== key))
    console.log('set obj', n)
    set({ obj: n })
  },
}))

export const Test: FC = () => {
  const obj = useTestStore((state) => state.obj)
  const setObj = useTestStore((state) => state.setObj)
  const removeKey = useTestStore((state) => state.removeKey)

  return (
    <div>
      <h1>Test</h1>
      <button onClick={() => setObj({ test: 'test' })}>set obj</button>
      <button onClick={() => setObj({})}>set empty</button>
      <button onClick={() => removeKey('test')}>remove key</button>
      <button onClick={() => removeKey('test')}>remove key2</button>
      <p>{JSON.stringify(obj)}</p>
    </div>
  )
}
