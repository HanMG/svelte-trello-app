// store 내부에서 사용할 변수는 앞에 _를 붙임

import { writable } from 'svelte/store'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _remove from 'lodash/remove'
import _cloneDeep from 'lodash/cloneDeep'

const generateId = () => cryptoRandomString({ length: 10 })

const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []

const _lists = writable(repoLists)
_lists.subscribe($lists => {
    window.localStorage.setItem('lists', JSON.stringify($lists))
})

export const lists = {
    subscribe: _lists.subscribe,
    reorder(payload) {
        const { oldIndex, newIndex } = payload
        _lists.update($lists => {            
            const clone = _cloneDeep($lists[oldIndex])
            $lists.splice(oldIndex, 1)
            $lists.splice(newIndex, 0, clone)
            return $lists
        })
    },
    add(payload) {
        const { title } = payload
        _lists.update($lists => {
            $lists.push({
                id: generateId(),
                title,
                cards: []
            })
            return $lists
        })
    },
    edit(payload) {
        const {listId, title} = payload
        _lists.update($lists => {            
            const foundList = _find($lists, { id: listId })
            foundList.title = title
            return $lists
        })
    },
    remove(payload) {
        const {listId} = payload
        _lists.update($lists => {
            _remove($lists, {id: listId})
            return $lists
        })
    }
    
}