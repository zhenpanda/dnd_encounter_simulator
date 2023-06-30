const roll = (diceType) => {
    const getRandomInt = (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    switch(diceType) {
        case "d20": return getRandomInt(1,20)
        case "d12": return getRandomInt(1,12)
        case "d10": return getRandomInt(1,10)
        case "d8": return getRandomInt(1,8)
        case "d6": return getRandomInt(1,6)
        case "d4": return getRandomInt(1,4)
        default: return 0
    }
}
// roll("d20")

const hitPercent = (enemyAC, attackModify) => {
    return ((21-(enemyAC-attackModify))/20 *100 ).toFixed(2)
}

const damage = (damageType) =>{
    switch(damageType) {
        case "greataxe": return roll("d12") + 3
        case "firebolt": return roll("d10")
        case "longbow": return roll("d8") + 3
        default: return 0
    }
}
// damage("greataxe")

class PlayerCharacter {
    
    constructor(weapon, attackModify, logger) {
      this.weapon = weapon
      this.attackModify = attackModify
      this.damageDealt = 0
      this.logger = logger
    }

    attack(enemyAC, bonusDamage) {
        const attackRoll = roll("d20")
        const damageRoll = damage(this.weapon)
        this.logger && console.log("log","attackRoll is:", attackRoll)

        // 𝑃 = (21−(AC−HIT))/20 × 100 
        const percentageToHit = hitPercent(enemyAC, this.attackModify)
        this.logger && console.log("log","Chance to hit is:", percentageToHit,"%")

        if((attackRoll + this.attackModify) >= enemyAC) {
            this.logger && console.log("log","Attack connects! damage dealt:", damageRoll)
            this.damageDealt = this.damageDealt + damageRoll + bonusDamage
        }else{
            this.logger && console.log("log","Attack missed")
        }
        this.logger && console.log("log", "Damage done so far:", this.damageDealt)
    }
}

// const barbarian = new PlayerCharacter("greataxe", 5, false)
// barbarian.attack(14)

const round = (enemyAC, numberOfRound, specificCombatRoundCount, character, bonusDamage) => {
    for(let r=0; r<numberOfRound; r++) {
        character.attack(enemyAC, bonusDamage)
    }
    console.log("log", 'hitPercent average:', hitPercent(enemyAC, character.attackModify) + "%")
    console.log("log", `Damage done total after ${numberOfRound} rounds:`, character.damageDealt)
    console.log("log", "Average damage per single round:", character.damageDealt/numberOfRound)
    console.log("log", `Average damage per ${specificCombatRoundCount} round:`, character.damageDealt/numberOfRound*specificCombatRoundCount)
} 

// round(14, 5000000, 5, barbarian) 
// total damage average 28.5

// const sorcerer = new PlayerCharacter("firebolt", 5, false) 
// round(14, 5000000, 5, sorcerer)
// total damage average 16.5

const ranger = new PlayerCharacter("longbow", 5, false) 
round(14, 5000000, 4, ranger, 1)
// total damage average 22.5

// 3 players = 67 damage per 5 rounds
// average player does 22.5 damage per 5 rounds per round 4.5 damage
// 6 * 4.5 = 27 damage 

// give movement item (passive bonues) after use
// after this item is ues +2 damage if melee + 1 any other type of damage
/*

    Scripted fight (Orc lv:14): 
        
        Ability Pre-move

        1. Damage - (x2 adds) 
        2. Run - (Stunned strike 1) (dex saving-throw)
        3. Damage+ [ double damage] - (hits floor -> self stunned) 
        4. Rage - (Fisure strike range only)
        5. Run - (Stunned strike 2) (dex saving-throw)
        6. Damage+ [ double damage] - (Raged)
    
    [4] damage cycles
        1PC: 18hp 
        2PC: 36hp 
        3PC: 54hp
        4PC: 72hp
        5PC: 90hp
        6PC: 108hp

*/