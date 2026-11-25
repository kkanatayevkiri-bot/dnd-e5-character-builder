class ClassSheet
{
    constructor(
        subclass,
        spells,
        cantrips,
        hitDice,
        HitPoints,
        features=[],
        armor,
        weapons,
        Tools,
        savingThrowProficiencies,
        skillProficiencies,
        skillExpertise,
        proficiency,
        proficiencyNum,
        expertiseNum,
    )
    {
        //what can be set.
        this.subclass = subclass === null? "":subclass
        this.spells = spells === null? {
            1:[],
            2:[],
            3:[],
            4:[],
            5:[],
            6:[],
            7:[],
            8:[],
            9:[],
            10:[],
            11:[],
            12:[],
            13:[],
            14:[],
            15:[],
            16:[],
            17:[],
            18:[],
            19:[],
            20:[]
        }:spells
        this.cantrips = cantrips === null? []: cantrips
        this.hitDice = hitDice;
        this.baseHp = HitPoints; //int
        this.features = features //list
        this.armor = armor; //list
        this.weapons = weapons; //list
        this.Tools = Tools; //boolean
        this.savingThrowProficiencies = savingThrowProficiencies; //dict
        this.skillProficiencies = skillProficiencies; //dict
        this.skillExpertise = skillExpertise; //dict
        this.proficiency = proficiency; //int
        this.proficiencyNum = proficiencyNum; //int
        this.expertiseNum = expertiseNum; //int

        //stats
        this.stats = {
            'strength': 8,
            'dexterity': 8,
            'constitution': 8,
            'intelligence': 8,
            'wisdom': 8,
            'charisma': 8
        };
        this.skills = {
            "strength":{"Athletics":-1},
            "dexterity":{
                "Acrobatics":-1,
                "Sleight of Hand":-1,
                "Stealth":-1
            },
            "intelligence":{
                "Arcana":-1,
                "History":-1,
                "Investigation":-1,
                "Nature":-1,
                "Religion":-1
            },
            "wisdom":{
                "Animal Handling":-1,
                "Insight":-1,
                "Medicine":-1,
                "Perception":-1,
                "Survival":-1
            },
            "charisma":{
                "Deception":-1,
                "Intimidation":-1,
                "Performance":-1,
                "Persuasion":-1
            }
        }
        this.level = 1;
        this.currentPoints = 27;
        this.currHp = this.calcHitPoints(); //int
    }

    calcHitPoints()
    {
        return Math.max(1,this.baseHp+this.getModifire('constitution'));
    }

    newHpVal(currlvl=this.level, targetlvl=this.level, die=this.HitPoints)
    {
        for(let lvl=currlvl;lvl<targetlvl;lvl++)
        {
            const num = Math.floor(Math.random()*die)+1+this.getModifire("constitution");
            this.currHp += Math.max(1, num);
        }
    }

    addPoint(stat)
    {
        if (this.stats[stat] >= 20 || this.currentPoints === 0)return;

        this.stats[stat]++;
        this.currentPoints--;

        //update visual
        this.updateStat(stat);
        this.updateModifire(stat);
        this.updateSavingThrow(stat);
        this.updateCharacter();
    }

    decPoint(stat)
    {
        if (this.stats[stat] === 8 || this.currentPoints === 24)return;

        this.stats[stat]--;
        this.currentPoints++;

        //update visual
        this.updateStat(stat);
        this.updateModifire(stat);
        this.updateSavingThrow(stat);
        this.updateCharacter();
    }

    getST(stat) //saving Throw
    {
        let mod = this.getModifire(stat);
        return this.savingThrowProficiencies[stat]? mod+this.proficiency: mod;
    }

    updateStat(stat)
    {
        let container = document.getElementById(`stat-${stat}`);
        container.innerHTML = this.stats[stat];
    }

    updateModifire(stat)
    {
        let content = document.getElementById(`modifire-${stat}`);
        content.innerHTML = this.getModifire(stat);
    }

    updateSavingThrow(stat)
    {
        let content = document.getElementById(`saving-throw-${stat}`);
        let num = this.getModifire(stat);
        if (this.savingThrowProficiencies[stat])num+=this.proficiency;
        content.innerHTML = num;
    }

    getModifire(stat)
    {
        return Math.floor((this.stats[stat]-10)/2);
    }

    updateSkills()
    {
        for (const stat of Object.keys(this.skills))
        {
            for(let [skill, _] of Object.entries(this.skills[stat]))
            {
                let cont = document.getElementById(`${skill}-num`);
                let num = this.getModifire(stat);
                if(this.skillProficiencies[skill])num+=this.proficiency;
                if(this.skillExpertise[skill])num+=this.proficiency;
                this.skills[stat][skill]=num;
                cont.innerHTML = num;
                // console.log(val);
            }
        }
    }

    //proficincy logic:
    disableNoneProficient()
    {
        // console.log("click");
        const skills = document.querySelectorAll('input[name="proficiency"]');
        const proficentSkills = Object.keys(this.skillProficiencies);
        // console.log(proficentSkills);
        skills.forEach((skill)=>{
            if (!proficentSkills.includes(skill.value))skill.disabled=true;
            else skill.disabled=false;
        })
    }

    checkSkill(skill)
    {
        if (Object.keys(this.skillProficiencies).includes(skill))
        {
            // console.log("worked");
            if(this.skillProficiencies[skill]===false)this.skillProficiencies[skill]=true;
            else this.skillProficiencies[skill]=false;
            // console.log(this.skillProficiencies);
        }
    }

    disableUnhceckedSKills()
    {
        // console.log('works');
        const skills = Object.entries(this.skillProficiencies);
        // console.log(skills);
        for(const [skill, bool] of skills)
        {
            const skillBox = document.querySelector(`input[value="${skill}"]`);
            if (!bool)skillBox.disabled=true;
        }
    }

    countProficincyPoints()
    {
        let num = document.querySelectorAll('input[name="proficiency"]:checked').length;
        let pline = document.getElementById('Ppoints');
        pline.innerHTML = this.proficiency-num;
    }

    turnOnPossibleExpertise(skill)
    {
        const isProf = Object.keys(this.skillExpertise).includes(skill)??false;
        const isEper = this.skillProficiencies[skill]??false;
        const skillLine = document.getElementById(`exp-${skill}`);
        console.log(isProf, isEper);
        if(isProf && isEper)
        {
            skillLine.disabled = false;
        }
    }

    proficiencyCap(skill)
    {
        this.checkSkill(skill);
        this.turnOnPossibleExpertise(skill);
        let num = document.querySelectorAll('input[name="proficiency"]:checked').length;
        this.countProficincyPoints();
        this.updateCharacter();
        if (num == this.proficiencyNum)
        {
            this.disableUnhceckedSKills();
        }
    }

    //Expertise logic:
    countExpertisePoints()
    {
        let num = document.querySelectorAll('input[name="expertise"]:checked').length;
        let line = document.getElementById('Epoints');
        line.innerHTML = this.expertiseNum - num;
    }

    turnOffNoneExpertise()
    {   
        const exper = document.querySelectorAll('input[name="expertise"]');
        exper.forEach((skill)=>{
            if(!this.skillProficiencies[skill.value])skill.disabled = true;
            if (skill.checked) skill.disabled = false;
        })
    }

    keepCheckedOn()
    {
        const exper = document.querySelectorAll('input[name="expertise"]:checked');
        exper.forEach((skill)=>{
            if(skill.checked && !this.skillProficiencies[skill.value])skill.checked = false;
            skill.disabled = false;
        })
    }

    turnOffNoneCheckedExpertise()
    {
        let exper = document.querySelectorAll('input[name="expertise"]');
        exper.forEach((skill)=>
        {
            if (!skill.checked)skill.disabled=true;
        })
    }

    toggleExpertise(skill)
    {
        if(!this.skillExpertise[skill])this.skillExpertise[skill]=true; //turn on if off.
        else this.skillExpertise[skill]=false; //turn off if on. (if selected again)
    }

    expertiseCap(skill)
    {
        this.toggleExpertise(skill);
        let num = document.querySelectorAll('input[name="expertise"]:checked').length;
        this.countExpertisePoints();
        if(num == this.expertiseNum)
        {
            this.turnOffNoneCheckedExpertise();
        }
        else
        {
            this.updateCharacter();
        }
    }

    resetChecked()
    {
        const prof = document.querySelectorAll('input[name="proficiency"]:checked');
        const exper = document.querySelectorAll('input[name="expertise"]:checked');

        prof.forEach((skill)=>{
            skill.checked = false;
        })

        exper.forEach((skill)=>{
            skill.checked = false;
        })
    }

    //render:
    renderStats()
    {
        // console.log("worked");
        let placeHolder = document.getElementById('stat-cont');
        let content = "";
        for(const [stat, val] of Object.entries(this.stats))
        {
            content+=`<button onclick='currClass.addPoint("${stat}")'>+</button>${stat}:<div id='stat-${stat}' style='display:inline;'>${val}</div><button onclick="currClass.decPoint('${stat}')">-</button><br><br>`
        }
        placeHolder.innerHTML = content;
    }

    rederModifier()
    {
        let placeHolder = document.getElementById('modifiers-cont');
        let content = "";
        let statsLis = Object.keys(this.stats)
        statsLis.forEach((stat)=>{
            content+=`${stat}: <div id='modifire-${stat}' style='display:inline;'>${this.getModifire(stat)}</div><br><br>`
        })
        placeHolder.innerHTML = content;
    }

    renderST() //Saving Throw
    {
        let content = document.getElementById('saving-throws-cont');
        let continer = "";
        let statsLis = Object.keys(this.stats);
        statsLis.forEach((stat)=>{
            continer+=`${stat}: <div id='saving-throw-${stat}' style='display:inline;'>${this.getST(stat)}</div><br><br>`
        })
        content.innerHTML = continer;
    }

    renderFeatures()
    {
        let container = document.getElementById("Features-cont");
        let content = `<ul>`;
        for(const feature of this.features)
        {
            content+=`<li>${feature}</li>`
        }
        content += '</ul>'
        container.innerHTML=content;
    }

    renderPoints()
    {
        let continer = document.getElementById("points-cont");
        continer.innerHTML = this.currentPoints;
    }

    //auto points setter:
    rollingDice()
    {
        for(const stat of Object.keys(this.stats))
        {
            this.stats[stat] = this.rollDie();
            this.updateStat(stat);
            this.updateModifire(stat);
        }
        this.currentPoints = 0;
        this.updateCharacter();

    }
    //4d6
    rollDie()
    {
        let dies = [];
        for (let i=0;i<4;i++)
        {
            dies.push(Math.floor(Math.random() * 6) + 1)
        }
        dies.sort();
        dies.pop();
        let sum = 0;
        for(let num of dies)sum+=num;
        return sum;
    }

    resetPoinst()
    {
        for(const stat of Object.keys(this.stats))
        {
            this.stats[stat] = 8;
            this.updateStat(stat);
            this.updateModifire(stat);
        }
        this.currentPoints = 27;
        this.updateCharacter();
    }

    //refresh after every input:
    updateCharacter()
    {
        this.renderPoints();
        this.updateSkills();
        this.keepCheckedOn();
        this.disableNoneProficient();
        this.turnOffNoneExpertise();
        this.countProficincyPoints();
        this.countExpertisePoints();
        this.rollDie();
        this.HitPoints = this.calcHitPoints();
    }

    //when switching/loading a class
    loadCharacter()
    {
        this.updateCharacter();
        this.renderFeatures();
        this.renderStats();
        this.rederModifier();
        this.renderST();
        this.resetChecked();
    }
}

class Paldain extends ClassSheet
{
    constructor()
    {
        super(
        null,
        null,
        null,
        "1d10",
        10,
        ["Divine Sense", "Lay on Hands"],
        ["all armors"],
        ['simple weapons', 'martial weapons'],
        null,
        {
            'strength': false,
            'dexterity': false,
            'constitution': false,
            'intelligence': false,
            'wisdom': true,
            'charisma': true,
        },
        {
            "Athletics":false,
            "Insight":false,
            "Intimidation":false,
            "Medicine":false,
            "Persuasion":false,
            "Religion":false
        },
        {},
        2,
        2,
        0
    )
    }
}

class Fighter extends ClassSheet
{
    constructor()
    {
        super(
        null,
        null,
        null,
        "1d10",
        10,
        ["Fighting Style", "Second Wind"],
        ["all armors",'shields'],
        ['simple weapons', 'martial weapons'],
        null,
        {
            'strength': true,
            'dexterity': false,
            'constitution': true,
            'intelligence': false,
            'wisdom': false,
            'charisma': false,
        },
        {
            "Acrobatics":false,
            "Animal Handling":false,
            "Athletics":false,
            "History":false,
            "Insight":false,
            "Intimidation":false,
            "Perception":false,
            "Survival":false
        },
        {"Acrobatics":false,},
        2,
        2,
        0
    )
    }
}

const classes = {'paladin':new Paldain(), 'fighter':new Fighter()}
let currClass = classes['paladin'];
currClass.loadCharacter();

function changeClass(c)
{
    currClass = classes[c];
    currClass.loadCharacter();
}
