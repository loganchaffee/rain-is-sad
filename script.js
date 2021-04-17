const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let controller = {
    left: false,
    right: false,
    up: false,
    keyEventListener: function (event) {
        let keyState = (event.type === 'keydown') ? true : false

        switch (event.key) {
            case 'a':
                controller.left = keyState
                break;
            case 'd':
                controller.right = keyState
                break;
            case ' ':
                controller.up = keyState
                break;
            case 's':
                controller.down = keyState
                break;
        }

    },
    clickEventListener: function (event) {
        let projectile = new Projectile(player.x + 15, player.y, 6, -10)
        projectiles.push(projectile)
    }
}
// --------------------------------------------------------------------------
class Player {
    constructor(x, y, width, height, xVelocity, yVelocity, jumping) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.xVelocity = xVelocity
        this.yVelocity =  yVelocity
        this.jumping = true
    }   
    draw(){
        ctx.beginPath()
        ctx.fillStyle = '#964000'
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fill()
    }
    update(){
        if (controller.up && player.jumping == false) {
            this.yVelocity -= 40
            this.jumping = true
        }
        if (controller.left) {
            this.xVelocity -= 1.3;
        }
        if (controller.right) {
            this.xVelocity += 1.;
        }

        this.yVelocity += 2 // gravity (always moving player down)
        this.x += this.xVelocity
        this.y += this.yVelocity
        this.xVelocity *= .9 //friction (always slowing the player down)
        this.yVelocity *= .9 //friction (always slowing the player down)

        //if player if lowering through the floor
        if (this.y > canvas.height - 25 - 25) {
            this.jumping = false
            this.y = canvas.height - 25 - 25
            this.yVelocity = 0 // downward movement must be 0, or player can't jumping right
        }
        if (this.x < -50) { // if player is going off the left
            this.x = 600
        } else if (this.x > 600) { // if player is going off the right
            this.x = -50
        }

        this.draw()
    }   
}

// -------------------------------------------------------------------------

class Projectile {
    constructor(x, y, radius, yVelocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.yVelocity = yVelocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = 'white'
        ctx.fill()
    }

    update() {
        this.draw()
        this.y += this.yVelocity
    }
}

// -------------------------------------------------------------------------

class Enemy {
    constructor(x, y, radius, xVelocity, yVelocity, direction){
        this.x = x
        this.y = y
        this.radius = radius
        this.xVelocity = xVelocity
        this.yVelocity = yVelocity
        this.direction = direction

    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = 'white'
        ctx.fill()
    }
    update(){
        this.draw()
        if (this.direction === 'right') {
            this.x += this.xVelocity
        }
        if (this.direction === 'left') {
            this.x -= this.xVelocity
        }
        this.y += this.yVelocity
    }
}

// -------------------------------------------------------------------------

// Event Listeners
window.addEventListener('keydown', controller.keyEventListener)
window.addEventListener('keyup', controller.keyEventListener)
window.addEventListener('click', controller.clickEventListener)

// Class Instances
let player = new Player(canvas.width / 2 - 25, canvas.height - 50, 30, 30, 0, 0, true)

let enemyVelocity = .5
let enemies = [
    new Enemy(25, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(75, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(125, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(175, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(225, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(275, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(325, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(375, 25, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(425, 25, 12.5, enemyVelocity, .05, 'right'),

    new Enemy(25, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(75, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(125, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(175, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(225, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(275, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(325, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(375, 75, 12.5, enemyVelocity, .05, 'right'),
    new Enemy(425, 75, 12.5, enemyVelocity, .05, 'right'),
]


let projectiles = []
let projectile = new Projectile(player.x + 15, player.y, 6, -20)

// -------------------------------------------------------------------------

// Game Loop
let animate = function () {
    ctx.clearRect(0,0,600,600)
    
    player.update()// Renders Player

    projectiles.forEach((projectile, index) => {
        projectile.update()
        // remove projectiles from edges of screen
        if (projectile.y < 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        }
    })

    enemies.forEach((enemy, index) => { // Rendering each enemy in array
        
        if (enemy.x + enemy.radius === 550) { // If left enemy hits wall
            enemies.forEach(enemy => {
                enemy.direction = 'left'
                enemy.update()
            });
        } else if (enemy.x - enemy.radius === 0) { // If right enemy hits wall
            enemies.forEach(enemy => {
                enemy.direction = 'right'
                enemy.update()
            });
        } else { // Render enemies that arent hitting wallsdfda
            enemy.update()
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            if (dist - enemy.radius - projectile.radius < 1) {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
            }
        });
    })

    if (enemies.length === 0) {
        alert('Game Over')
    }


    window.requestAnimationFrame(animate)
}
animate()
