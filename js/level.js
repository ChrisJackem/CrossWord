import { LetterMenuItem, LetterMenu } from './menu.js'
import { ShowModal } from './modal.js'


// The tiles where the letters live
class Tile extends HTMLElement{

    /** 
     * Create a new tile, setup events
     * @param {Level} parent_level The level parent
     * @param {string} data The correct letter and an optional number ( '1a' )
     */
    constructor( parent_level, data ){
        super()
        content.appendChild(this)

        // Empty tile
        if ( data == '_'){ return }

        this.parent_level = parent_level

        // Extract Number / Letter
        this.number = data.length > 1 ? data[0] : 0
        this.letter = data.length > 1 ? data[1] : data[0]
        this.setAttribute('class', 'tile')

        // Create Letter holder
        const letter_holder = document.createElement('d')
            letter_holder.setAttribute('class', 'tile-letter')
        this.letter_holder = this.appendChild( letter_holder )
        
        // Add number div 
        if (this.number){
            let num_div = document.createElement('d')
            num_div.setAttribute('class', 'tile-number')
            num_div.innerHTML = this.number
            this.appendChild(num_div)
        }

    // Events

        // Drag over event
        this.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move"
            this.style= "transition: background-color 0.5s; background-color:green"
        });

        // Drag leave event
        this.addEventListener("dragleave", (e) => {
            this.style.backgroundColor = 'white'
        })

        // Drop event
        this.addEventListener('drop', e => {
            // Set letter
            const data = e.dataTransfer.getData("text")
            this.letter_holder.innerHTML = data

            // Here we fade in the letter with a class            
            this.letter_holder.classList.add('fade-in')

            // setTimeout to remove the class later
            if (this.my_timeout){ clearTimeout( this.my_timeout ) }
            this.my_timeout = window.setTimeout( ()=>{
                this.letter_holder.classList.remove('fade-in')
                this.my_timeout = null
            },1100)

            // Check tiles for completion
            parent_level.CheckTiles()
        })
    }    
}

/**
 * This handles the actual level -
 * Getting level data
 * Creating tiles
 * Populating the menu and level list buttons
 * Showing Modal when completed level/game
 */
export class Level{
    constructor(){
        this.current_level = undefined
        this.GetLevelData()

        // Font size update on resize
        // ( Sets content size -> content uses em )
        window.addEventListener('resize', e => this.SetFontSize() )
    }

    CheckTiles(){
        let level_correct = true
        for ( let tile of this.tiles ){
            if ( tile.letter_holder && tile.letter_holder.innerHTML != tile.letter){
                level_correct = false
            }
            tile.style = ''
        }

        // Level is complete
        if ( level_correct ){                   
            this.SetComplete( this.current_level )
            this.BuildLevel() 
        }
    }

    SetComplete( level_name ){

        // Set level button class to checked 
        let level_btn = this.level_buttons.filter( b => b.name==this.current_level )[0].button
        level_btn.classList.remove('unchecked')
        level_btn.classList.add('checked')

        // Show complete modal
        ShowModal( true, `${this.current_level} Complete!`, 
            `<div id="modal-pic">
                <img src="./img/ribbon.svg">
            </div>
            <p>You have correctly completed the ${this.current_level} level.</p>
            <br/>
            <p>You will be taken to the next level now, you can always come back by clicking the button in the "Levels" pane.</p>`
        )

        // Set level object to complete
        for ( let level of this.levels ){
            if (level.name == level_name){
                level.complete = true
                return
            }
        }
    }

    Win(){
        // Show complete modal
        ShowModal( true, `Congradulations!`, 
            `<div id="modal-pic">
                <img src="./img/trophy.svg">
            </div>
            <p>You have beaten the game!</p>
            <br/>
            <p>You can always redo a level by clicking a level button in the "Levels" pane.</p>`
        )
    }


    // Wait for levels json file then BuildLevel
    async GetLevelData(){
        this.levels = []
        await fetch( "levels.json" )
            .then( response => response.json() )
            .then( json => this.levels = json )

        // Add complete bool to each level
        for ( const i in this.levels ){
            this.levels[i].complete = false
        }       

        // Build Level elements
        this.BuildLevelButtons()
        this.BuildLevel()       
    }


    BuildLevel( level=null ){
        // If no level sent, find the next incomplete level
        let level_data
        if ( !level ){
            for ( let level of this.levels ){
                if ( level.complete ){ continue }
                level_data = level
                break                
            }
        // Get the level from name otherwise        
        }else{
            level_data = this.levels.filter( l => l.name == level )[0]
        }

        // We have beaten the game
        if (!level_data){            
            this.Win()
            return
        }

        this.current_level = level_data.name

        // Set up the level
        content.innerHTML = ''
        this.tiles = []
        this.letters = new Set()
        
        const tiles = level_data.squares
        const tile_columns = tiles[0].length
        content.style.gridTemplateColumns= `repeat( ${tile_columns}, 1fr )`
        
        // Build Tiles
        for ( let y=0; y<=tiles.length-1; y++  ){                        
            for ( let x=0; x<=tiles[y].length-1; x++ ){
                // Create new tile
                let tile_data = tiles[y][x]
                let new_tile = new Tile( this, tile_data )
                if (tile_data != '_'){
                    // This is to account for a possible number
                    this.letters.add( tile_data.at(-1) )                  
                }
                this.tiles.push( new_tile )
            }
        }

        this.SetFontSize()
        
        // Set title
        title.innerHTML = `<h2>${level_data.name}</h2>`

        // Add Letters to menu
        menu.SetLetterItems( this.letters )

        // Add Clues to menu
        menu.SetClues( level_data.clues )
        
    }

    SetFontSize(){
        let tile_width = this.tiles[0].clientWidth
        content.style.fontSize = `${tile_width / 2}px`
    }

    ////////////// Level Buttons //////////////////
    BuildLevelButtons(){
        this.level_buttons = []// Array of objects, { name, button }
        for ( const level of this.levels ){
            this.level_buttons.push({
                'name': level.name, 
                'button': this.BuildLevelButton(level.name) 
            })
        }
    }
    BuildLevelButton( level ){
        const btn = document.createElement('button')
        btn.classList.add('level-btn', 'unchecked')
        btn.innerHTML = level
        levels.appendChild(btn)
        btn.addEventListener( 'click', e => {
            this.BuildLevel( level )
        })
        return btn
    }
}

window.customElements.define('tile-square', Tile);