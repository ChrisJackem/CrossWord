
import { Level } from './level.js'
import * as Menu from './menu.js'
import * as Modal from './modal.js'

export var level

(()=>{   

    var content = document.getElementById('content')
    var title = document.getElementById('title')
    var menu = document.getElementsByTagName('letter-menu')[0]
    var cover = document.getElementById('cover')
    var cover_x = document.getElementById('cover-x')
    var levels = document.getElementById('levels')
    var modal = Modal.MODAL    
    level = new Level()

    Modal.ShowModal( true )

})()