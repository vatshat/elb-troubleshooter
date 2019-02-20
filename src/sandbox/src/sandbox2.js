/* let dragon = (name, size, element) => 
    name + ' is a ' +
    size + ' dragon that breathes ' + 
    element + '!'
    
let fluffykinsDragon = dragon('fluffykins') 
let tinyDragon = fluffykinsDragon('tiny')

console. log (tinyDragon('lightning'));
 */

let dragon = 
    name => {
        console.log("test")
        return size =>
            element =>
                `${name} is a ${size} dragon that breathes ${element}!` 
    }
                
console.log(dragon('fluffykins')('tiny')('thunder')) 

let
    fluffykinsDragon = dragon('fluffykins'),
    tinyDragon = fluffykinsDragon('tiny')

console.log(tinyDragon('lightning')) 
