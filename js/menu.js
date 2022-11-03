
import {level} from './main.js'

const MOBILE_ITEM = document.getElementById('menu-item-mobile')
const MOBILE_ITEM_INNER = document.getElementById('menu-item-mobile-inner')
const LEVEL = document.getElementById('')

export class LetterMenu extends HTMLElement{
    constructor(){
        super()
        this.items = []
        this.menu_tiles = document.getElementById('menu-tiles')
        this.clues_across = document.getElementById('across')
        this.clues_down = document.getElementById('down')
    }

    // Creating the letter draggable list
    SetLetterItems( letters ){
        this.menu_tiles.innerHTML = `<h3>Letters:</h3>`
        for ( const letter of letters ){
            const new_letter = new LetterMenuItem( letter )
            this.menu_tiles.appendChild ( new_letter )
        }        
    }

    // Set up the clues lists
    SetClues( clues ){
        this.clues_across.innerHTML = `<h4>Across</h4>`
        this.clues_down.innerHTML = `<h4>Down</h4>`
        for ( let clue of clues.across ){
            this.clues_across.innerHTML += `<li>${clue}</li>`
        }
        for ( let clue of clues.down ){
            this.clues_down.innerHTML += `<li>${clue}</li>`
        }
    }
    
}

// These are the individual letter buttons
export class LetterMenuItem extends HTMLElement{
    constructor( data ) {
        super()
        this.setAttribute('draggable', true)
        this.setAttribute('class', 'menu-item')
        this.innerHTML = data

        this.collided_tile = null

        this.addEventListener('dragstart', e =>{
            e.dataTransfer.setData("text/plain", this.innerHTML);
        })

        // Mobile
        this.addEventListener( 'touchstart', e=> {
            MOBILE_ITEM.style = ''
            MOBILE_ITEM_INNER.innerHTML = this.innerHTML

            let location = e.targetTouches[0]
            MOBILE_ITEM.style.left = `${location.pageX - 20}px`
            MOBILE_ITEM.style.top = `${location.pageY - 50}px`

            // Moving
            this.addEventListener( 'touchmove', this.TouchMoveHandler )
            this.addEventListener( 'touchend', this.TouchDropHandler )
        })
    }    

    // mobile
    TouchMoveHandler(e){
        e.preventDefault()
        let location = e.targetTouches[0]
        MOBILE_ITEM.style.left = `${location.pageX - 25}px`
        MOBILE_ITEM.style.top = `${location.pageY - 60}px`
        this.GetCollide()
    }
    TouchDropHandler(e){
        MOBILE_ITEM.style = 'display:none'
        this.removeEventListener( 'touchmove', this.TouchMoveHandler )
        this.removeEventListener( 'touchend', this.TouchDropHandler )

        // Creating a fake drop event on the tile
        if (this.collided_tile){
            this.collided_tile.style.backgroundColor = 'white'
            let drop_event = new DragEvent('drop', {dataTransfer:new DataTransfer()})
            drop_event.dataTransfer.setData("text/plain", this.innerHTML);
            this.collided_tile.dispatchEvent(drop_event)
        }
    }
    GetCollide(){
        let m = { x: parseInt(MOBILE_ITEM.style.left), y: parseInt(MOBILE_ITEM.style.top), height: MOBILE_ITEM.clientHeight, width: MOBILE_ITEM.clientWidth }
        let collide = []
        
        for ( const tile of level.tiles ){
            if (!tile.hasOwnProperty('number')){ continue }
            tile.style.backgroundColor = 'white'
            let rect = tile.getBoundingClientRect()
            let t = { x: rect.left, y: rect.top, height: rect.height, width: rect.width }            
            
            // Collision 
            if ( !( ((m.y + m.height) < (t.y)) || (m.y > (t.y + t.height)) || ((m.x + m.width) < t.x) || (m.x > (t.x + t.width)) ) ){
                
                // Store tile and distance in collide array

                let a = m.x - t.x// Distance calcs
                let b = m.y - t.y       

                collide.push({
                    'tile': tile, 
                    "distance": Math.sqrt( a*a + b*b ) })
            }
        }
        if ( collide.length ){

            // Get closest tile that is colliding
            let closest_distance = Infinity
            let closest_tile = null
            for ( let obj of collide ){
                if (obj.distance < closest_distance){
                    closest_tile = obj.tile
                    closest_distance = obj.distance
                }
            }

            this.collided_tile = closest_tile
            closest_tile.style = "transition: background-color 0.5s; background-color:green"
        }        
    }
}

window.customElements.define('letter-menu', LetterMenu);
window.customElements.define('menu-item', LetterMenuItem);