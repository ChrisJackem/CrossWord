
export const MODAL = document.getElementById('modal')
const MODAL_X = document.getElementById('modal-x')
const MODAL_TITLE = document.getElementById('modal-title')
const MODAL_CONTENT = document.getElementById('modal-content')
let modal_animating = false

/**
 * In main.css :
 * transition: opacity;
 * transition-duration: 0.5s;
 * @param {boolean} show Show or hide modal
 */
export function ShowModal( show, title=null, txt=null ){
    modal_animating = true
    
    MODAL.classList.remove( show ? 'hidden' : 'showing' )
    const temp_class = show ? 'showing' : 'hidden'       
    MODAL.classList.add( temp_class )
    MODAL.style = ''

    if ( title && txt ){
        MODAL_TITLE.innerHTML = title
        MODAL_CONTENT.innerHTML = txt
    }

    setTimeout(()=> {        
        MODAL.style = show ? '' : 'display: none'
        MODAL.classList.remove( temp_class )
        modal_animating = false
    }, 500)
}

// Dismiss Modal
MODAL_X.addEventListener('click', function(e){
   if (modal_animating){
    return
   }
    ShowModal( false )
})