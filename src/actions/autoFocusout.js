export function autoFocusout(el, focusoutListener) {

    const focusinListener = event => {
        event.stopPropagation()
    }

    setTimeout( () => {
        el.addEventListener('click', focusinListener)
        window.addEventListener('click', focusoutListener)
    })    

    return {        
        // 요소가 파괴되면 실행, 이벤트를 지워주도록
        destroy() {
            el.removeEventListener('click', focusinListener)
            window.removeEventListener('click', focusoutListener)
        }
    }
}